import * as React from 'react';
import { Route, RouteProps, Redirect, RouteComponentProps } from 'react-router-dom'
import { Observable } from 'rxjs';
import * as _ from 'lodash';

/**
 * Debug logging theme
 */
const SecureRouteLoggerConsoleTheme = {
  normal: '',
  testing: 'color: darkcyan; font-size: 0.7rem; font-style: italic;',
  important: 'color: green; font-size: 0.7rem; font-style: normal; font-weight: bold',
  error: 'color: red; font-size: 0.7rem; font-style: normal; font-weight: bold'
};

/**
 * Debug loggin
 */
const debugLogger = (className: string, methodName: string, msg: string, displayFormat?: string, extraData?: any) => {

  const messageToPrint = displayFormat ? `%c[${className} - ${methodName}] ${msg}` : `[${className} - ${methodName}] ${msg}`;

  if (displayFormat) {
    if (extraData) {
      console.log(messageToPrint, displayFormat, extraData);
    } else {
      console.log(messageToPrint, displayFormat);
    }
  } else {
    if (extraData) {
      console.log(messageToPrint, extraData);
    } else {
      console.log(messageToPrint);
    }
  }
}

interface RouteGuardResult { match: boolean; path: string };
export type RouteGuardResultMap = RouteGuardResult[] | Promise<RouteGuardResult[]> | Observable<RouteGuardResult[]>

export interface RouteGuard {
  shouldRoute?: () => RouteGuardResultMap;
}

export interface SecureRouteProps extends RouteProps {
  routeGuard?: RouteGuard
  enableDebug?: boolean
  componentWhenFail?: React.ComponentType<RouteComponentProps<any> | {}>
}

export interface SecureRouteState {
  hasRouteGuard: boolean;
  routeGuardFinished: boolean;
  routeGuardResult: boolean | null;
  redirectPath: string;
}

export class SecureRoute extends React.Component<SecureRouteProps, SecureRouteState> {

  constructor(props: SecureRouteProps) {
    super(props)
    this.state = {
      hasRouteGuard: this.props.routeGuard ? true : false,
      routeGuardFinished: false,
      routeGuardResult: null,
      redirectPath: '/',
    }
  }

  async componentDidMount() {
    if (!this.state.hasRouteGuard || !this.props.routeGuard) {
      return
    }
    const { shouldRoute } = this.props.routeGuard;
    if (!shouldRoute) {
      return;
    }
    const tempRouteGuardResult = shouldRoute();
    const handle = (results: RouteGuardResult[]) => {
      const res = _.find(results, it => !it.match);
      this.setState({
        routeGuardFinished: true,
        routeGuardResult: !res,
        redirectPath: res ? res.path : '/',
      })
    }
    if (tempRouteGuardResult instanceof Array) {
      handle(tempRouteGuardResult);
    } else if (tempRouteGuardResult instanceof Promise) {
      tempRouteGuardResult.then(result => {
        handle(result);
      })
    } else if (tempRouteGuardResult instanceof Observable) {
      tempRouteGuardResult
        .take(1)
        .subscribe(result => {
          handle(result);
        })
    }
  }

  render() {
    const successRoute: JSX.Element = <Route {...this.props} />

    // If hasn't `routeGuard` props, then just render the real <Route>
    if (!this.state.hasRouteGuard) {
      if (this.props.enableDebug) {
        debugLogger((this as any).constructor.name, `render`, `no route guard to run, render normal <Route> directly.`, SecureRouteLoggerConsoleTheme.testing)
      }

      return successRoute
    }

    const redirectPath = this.state.redirectPath;
    const failRedirect = <Redirect to={redirectPath} />
    const failComponentRoute = this.props.componentWhenFail ? <Route path={this.props.path} component={this.props.componentWhenFail} /> : null

    if (this.state.routeGuardFinished) {
      if (this.props.enableDebug) {
        let debugMsg = `route guard passed, render <Route>.`;
        const className = (this as any).constructor.name;
        let debugTheme = SecureRouteLoggerConsoleTheme.testing;

        if (!this.state.routeGuardResult) {
          debugMsg = `route guard fail, render <Redirect to=${redirectPath} />`
          debugTheme = SecureRouteLoggerConsoleTheme.error
        }

        debugLogger(className, `render`, debugMsg, debugTheme)
      }

      if (this.state.routeGuardResult) {
        return successRoute
      } else {
          // `componentWhenFail` got higher priority than `redirectToPathWhenFail`
        return this.props.componentWhenFail ? failComponentRoute : failRedirect
      }
    } else {
      return null
    }
  }
}
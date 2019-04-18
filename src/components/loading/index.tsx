import * as React from 'react';
import { Motion, spring } from 'react-motion';
import { app } from '../../utils';
import './style.css';

interface Props {
  loading: boolean,
  error: boolean,
  delay?: number,
  ownProps: {},
  Component: React.ComponentType
}

interface State {
  delaying: boolean,
}

const LoadingContent = <div>Loading</div>;

export default class Loading extends React.Component<Props, State> {

  static defaultProps = {
    delay: 200,
  };

  public state = {
    delaying: true,
  };
  private shownLoading = false;

  async componentDidMount() {
    const { delay } = this.props;
    await app.delay(delay || 0);
    this.setState({ delaying: false });
  }

  public render() {
    const { delaying } = this.state;
    if (delaying) {
      return null;
    }

    const { loading, Component, ownProps } = this.props;
    if (loading) {
      this.shownLoading = true;
      return LoadingContent;
    }

    if (this.shownLoading) {
      return (
        <Motion defaultStyle={{ op: 0 }} style={{ op: spring(1) }}>
          {({ op }) => (
            <div className="loading-component">
              <div className="loading-content" style={{ opacity: 1 - op }}>{LoadingContent}</div>
              <div className="loaded-content" style={{ opacity: op }}><Component {...ownProps} /></div>
            </div>
          )}
        </Motion>
      );
    }

    return <Component {...ownProps} />;
  }
}
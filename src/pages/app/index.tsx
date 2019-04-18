import * as React from 'react';
import * as routes from '../../routes';
import { Route, RouteComponentProps, Switch, withRouter, Redirect } from 'react-router';
import { BasicLayout, SecureRoute } from '../../components';

const RouteGuard = ({ ...others }) => (
  <SecureRoute {...others} routeGuard={routes.UserRouteGuard} />
);

class App extends React.Component<RouteComponentProps<any>> {

  renderRouter = () => (
    <Switch>
      <Route path="/login" component={routes.Login} />
      <BasicLayout {...this.props}>
        <Switch>
          <RouteGuard path="/feedback" component={routes.Feedback}/>
          <RouteGuard path="/safe" component={routes.Safe}/>
          <RouteGuard path="/presaleGoodsOrder" component={routes.PresaleGoodsOrder} />
          <RouteGuard path="/goodsOrder" component={routes.GoodsOrder} />
          <RouteGuard path="/presaleAuditDetail" component={routes.PresaleAuditDetail} />
          <RouteGuard path="/goods" component={routes.Goods} />
          <RouteGuard path="/presaleGoods" component={routes.PresaleGoods} />
          <RouteGuard path="/proOrder" component={routes.ProOrder} />
          <RouteGuard path="/offOrder" component={routes.OffOrder} />
          <RouteGuard path="/orderChargeRecords" component={routes.OrderChargeRecords} />
          <RouteGuard path="/factoryShowlist" component={routes.FactoryShowlist} />
          <RouteGuard path="/statistical" component={routes.Statistical} />
          <RouteGuard path="/serviceTreaty" component={routes.ServiceTreaty} />
          <RouteGuard path="/adverCenter" component={routes.AdverCenter} />
          <RouteGuard path="/uploadManagement" component={routes.UploadManagement} />
          <RouteGuard path="/versionControl" component={routes.VersionControl} />
          <RouteGuard path="/autoReply" component={routes.AutoReply} />
          <RouteGuard path="/fastReply" component={routes.FastReply} />
          <RouteGuard path="/goodPropsal" component={routes.GoodPropsal} />
          <RouteGuard path="/desiginOnCooperation" component={routes.DesiginOnCooperation} />
          <RouteGuard path="/desiginOnPublish" component={routes.DesiginOnPublish} />
          <RouteGuard path="/showImages" component={routes.ShowImages} />
          <RouteGuard path="/goodDetails" component={routes.GoodDetails} />
          <RouteGuard path="/desiginOnReview" component={routes.DesiginOnReview} />
          <RouteGuard path="/permissionConfig" component={routes.PermissionConfig} />
          <RouteGuard path="/roleConfig" component={routes.RoleConfig} />
          <RouteGuard path="/systemMenus" component={routes.SystemMenus} />
          <RouteGuard path="/presaleOrder" component={routes.PresaleOrder} />
          <RouteGuard path="/otherConfig" component={routes.OtherConfig} />
          <RouteGuard path="/biddingFactory" component={routes.BiddingFactory} />
          <RouteGuard path="/branch/:code" component={routes.Branch} />
          <RouteGuard path="/authenticatedUser" component={routes.AuthenticatedUser} />
          <RouteGuard path="/designerUser" component={routes.DesignerUser} />
          <RouteGuard path="/generalUser" component={routes.GeneralUser} />
          <RouteGuard path="/withdrawalapp" component={routes.Withdrawalapp} />
          <RouteGuard path="/orderCharge" component={routes.OrderCharge} />
          <RouteGuard path="/argConfigEdit" component={routes.ArgConfigEdit} />
          <RouteGuard path="/paramValue" component={routes.ParamValue} />
          <RouteGuard path="/secondClass" component={routes.SecondClass} />
          <RouteGuard path="/param" component={routes.Param} />
          <RouteGuard path="/firstClass" component={routes.FirstClass} />
          <RouteGuard path="/argConfig" component={routes.ArgConfig} />
          <RouteGuard path="/serviceList" component={routes.ServiceList} />
          <RouteGuard path="/goodDetails" component={routes.GoodDetails} />
          <RouteGuard path="/desiginOnReview" component={routes.DesiginOnReview} />
          <RouteGuard path="/permissionConfig" component={routes.PermissionConfig} />
          <RouteGuard path="/roleConfig" component={routes.RoleConfig} />
          <RouteGuard path="/systemMenus" component={routes.SystemMenus} />
          <RouteGuard path="/presaleOrder" component={routes.PresaleOrder} />
          <RouteGuard path="/otherConfig" component={routes.OtherConfig} />
          <RouteGuard path="/biddingFactory" component={routes.BiddingFactory} />
          <RouteGuard path="/branch" component={routes.Branch} />
          <RouteGuard path="/authenticatedUser" component={routes.AuthenticatedUser} />
          <RouteGuard path="/designerUser" component={routes.DesignerUser} />
          <RouteGuard path="/generalUser" component={routes.GeneralUser} />
          <RouteGuard path="/withdrawalapp" component={routes.Withdrawalapp} />
          <RouteGuard path="/orderCharge" component={routes.OrderCharge} />
          <RouteGuard path="/argConfigEdit" component={routes.ArgConfigEdit} />
          <RouteGuard path="/paramValue" component={routes.ParamValue} />
          <RouteGuard path="/secondClass" component={routes.SecondClass} />
          <RouteGuard path="/param" component={routes.Param} />
          <RouteGuard path="/firstClass" component={routes.FirstClass} />
          <RouteGuard path="/argConfig" component={routes.ArgConfig} />
          <RouteGuard path="/systemUsers" component={routes.SystemUsers} />
          <RouteGuard path="/argConfigEdit" component={routes.ArgConfigEdit} />
          <RouteGuard path="/paramValue" component={routes.ParamValue} />
          <RouteGuard path="/secondClass" component={routes.SecondClass} />
          <RouteGuard path="/param" component={routes.Param} />
          <RouteGuard path="/firstClass" component={routes.FirstClass} />
          <RouteGuard path="/argConfig" component={routes.ArgConfig} />
          <Redirect path="*" to="/login" />
        </Switch>
      </BasicLayout>
    </Switch>
  );

  render() {
    return (
      <div>
        {this.renderRouter()}
      </div>
    );
  }
}

export default withRouter(App);

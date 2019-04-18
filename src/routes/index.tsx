import * as React from 'react';
import loadable from 'loadable-components';
import { Loading, RouteGuard } from '../components';
import { authStore } from '../stores';

interface DefaultImportedComponent<P> {
  default: React.ComponentType<P>;
}

type DefaultComponent<P> = React.ComponentType<P> | DefaultImportedComponent<P>;

function generateLoadable<T>(getComponent: () => Promise<DefaultComponent<T>>) {
  return loadable(
    getComponent,
    {
      render: options => <Loading {...options} />,
    },
  );
}

export const UserRouteGuard: RouteGuard = {
  async shouldRoute() {
    return [
      {
        match: !!authStore.authorization,
        path: '/login',
      },
    ];
  }
};

export const Login = generateLoadable(() => import('../pages/login'));
export const ArgConfig = generateLoadable(() => import('../pages/arg-config'));
export const FirstClass = generateLoadable(() => import('../pages/arg-config/first-class'));
export const Param = generateLoadable(() => import('../pages/arg-config/param'));
export const SecondClass = generateLoadable(() => import('../pages/arg-config/second-class'));
export const ParamValue = generateLoadable(() => import('../pages/arg-config/param-value'));
export const ArgConfigEdit = generateLoadable(() => import('../pages/arg-config/arg-config-edit'));
export const OrderCharge = generateLoadable(() => import('../pages/order-charge'));
export const Withdrawalapp = generateLoadable(() => import('../pages/WithdrawalApp'));
export const GeneralUser = generateLoadable(() => import('../pages/general-user'));
export const DesignerUser = generateLoadable(() => import('../pages/designer-user'));
export const AuthenticatedUser = generateLoadable(() => import('../pages/authenticated-user'));
export const Branch = generateLoadable(() => import('../pages/designer-user/branch'));
export const BiddingFactory = generateLoadable(() => import('../pages/bidding-factory'));
export const SystemUsers = generateLoadable(() => import('../pages/system-users'));
export const SystemMenus = generateLoadable(() => import('../pages/system-menus'));
export const RoleConfig = generateLoadable(() => import('../pages/role-config'));
export const PermissionConfig = generateLoadable(() => import('../pages/permission-config'));
export const OtherConfig = generateLoadable(() => import('../pages/other-config'));
export const PresaleOrder = generateLoadable(() => import('../pages/presale-order'));
export const DesiginOnReview = generateLoadable(() => import('../pages/desigin-on-review'));
export const GoodDetails = generateLoadable(() => import('../pages/good-details'));
export const ShowImages = generateLoadable(() => import('../pages/desigin-on-review/show-images'));
export const ServiceList = generateLoadable(() => import('../pages/service-list'));
export const FastReply = generateLoadable(() => import('../pages/fast-reply'));
export const AutoReply = generateLoadable(() => import('../pages/auto-reply'));
export const VersionControl = generateLoadable(() => import('../pages/version-control'));
export const UploadManagement = generateLoadable(() => import('../pages/upload-management'));
export const AdverCenter = generateLoadable(() => import('../pages/adver-center'));
export const ServiceTreaty = generateLoadable(() => import('../pages/service-treaty'));
export const Statistical = generateLoadable(() => import('../pages/statistical'));
export const DesiginOnPublish = generateLoadable(() => import('../pages/desigin-on-publish'));
export const DesiginOnCooperation = generateLoadable(() => import('../pages/desigin-on-cooperation'));
export const GoodPropsal = generateLoadable(() => import('../pages/good-propsal'));
export const OrderChargeRecords = generateLoadable(() => import('../pages/order-charge/order-charge-records'));
export const FactoryShowlist = generateLoadable(() => import('../pages/factory-showlist'));
export const PresaleGoods = generateLoadable(() => import('../pages/presale-goods'));
export const Goods = generateLoadable(() => import('../pages/goods'));
export const PresaleAuditDetail = generateLoadable(() => import('../pages/presale-audit-detail'));
export const OffOrder = generateLoadable(() => import('../pages/off-order'));
export const ProOrder = generateLoadable(() => import('../pages/pro-order'));
export const GoodsOrder = generateLoadable(() => import('../pages/goods/goods-order'));
export const PresaleGoodsOrder = generateLoadable(() => import('../pages/presale-goods/presale-goods-order'));
export const Safe = generateLoadable(() => import('../pages/safe'));
export const Feedback = generateLoadable(() => import('../pages/feedback'));
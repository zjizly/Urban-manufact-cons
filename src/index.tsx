import { feedbackStore } from './stores/feedback-store';
import { safeStore } from './stores/safe-store';
import { presaleGoodsOrderStore } from './pages/presale-goods/presale-goods-order/presale-goods-order-store';
import { goodsOrderStore } from './pages/goods/goods-order/goods-order-store';
import { presaleAuditDetailStore } from './stores/presale-audit-detail-store';
import { goodsStore } from './stores/goods-store';
import { presaleGoodsStore } from './stores/presale-goods-store';
import { proOrderStore } from './stores/pro-order-store';
import { offOrderStore } from './stores/off-order-store';
import { orderChargeRecordsStore } from './pages/order-charge/order-charge-records/order-charge-records-store';
import { factoryShowlistStore } from './stores/factory-showlist-store';
import { statisticalStore } from './stores/statistical-store';
import { serviceTreatyStore } from './stores/service-treaty-store';
import { adverCenterStore } from './stores/adver-center-store';
import { uploadManagementStore } from './stores/upload-management-store';
import { versionControlStore } from './stores/version-control-store';
import { autoReplyStore } from './stores/auto-reply-store';
import { fastReplyStore } from './stores/fast-reply-store';
import { goodPropsalStore } from './stores/good-propsal-store';
import { desiginOnCooperationStore } from './stores/desigin-on-cooperation-store';
import { desiginOnPublishStore } from './stores/desigin-on-publish-store';
import { showImagesStore } from './pages/desigin-on-review/show-images/show-images-store';
import { serviceListStore } from './stores/service-list-store';
import { goodDetailsStore } from './stores/good-details-store';
import { desiginOnReviewStore } from './stores/desigin-on-review-store';
import { permissionConfigStore } from './stores/permission-config-store';
import { roleConfigStore } from './stores/role-config-store';
import { systemMenusStore } from './stores/system-menus-store';
import { presaleOrderStore } from './stores/presale-order-store';
import { otherConfigStore } from './stores/other-config-store';
import { biddingFactoryStore } from './stores/bidding-factory-store';
import { branchStore } from './pages/designer-user/branch/branch-store';
import { authenticatedUserStore } from './stores/authenticated-user-store';
import { designerUserStore } from './stores/designer-user-store';
import { generalUserStore } from './stores/general-user-store';
import { withdrawalappStore } from './stores/WithdrawalApp-store';
import { orderChargeStore } from './stores/order-charge-store';
import { systemUsersStore } from './stores/system-users-store';
import { argConfigEditStore } from './pages/arg-config/arg-config-edit/arg-config-edit-store';
import { paramValueStore } from './pages/arg-config/param-value/param-value-store';
import { secondClassStore } from './pages/arg-config/second-class/second-class-store';
import { paramStore } from './pages/arg-config/param/param-store';
import { firstClassStore } from './pages/arg-config/first-class/first-class-store';
import { argConfigStore } from './stores/arg-config-store';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { Provider } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './pages/app';
import registerServiceWorker from './registerServiceWorker';
import {
  netStore,
  toolStore,
  loginPageStore,
  authStore,
} from './stores';

const stores = {
  argConfigStore,
  firstClassStore,
  paramStore,
  secondClassStore,
  paramValueStore,
  argConfigEditStore,
  orderChargeStore,
  withdrawalappStore,
  generalUserStore,
  designerUserStore,
  authenticatedUserStore,
  branchStore,
  biddingFactoryStore,
  systemUsersStore,
  systemMenusStore,
  roleConfigStore,
  permissionConfigStore,
  otherConfigStore,
  presaleOrderStore,
  desiginOnReviewStore,
  goodDetailsStore,
  showImagesStore,
  fastReplyStore,
  autoReplyStore,
  versionControlStore,
  uploadManagementStore,
  adverCenterStore,
  serviceTreatyStore,
  statisticalStore,
  desiginOnPublishStore,
  desiginOnCooperationStore,
  goodPropsalStore,
  orderChargeRecordsStore,
  factoryShowlistStore,
  presaleGoodsStore,
  goodsStore,
  presaleAuditDetailStore,
  offOrderStore,
  proOrderStore,
  goodsOrderStore,
  presaleGoodsOrderStore,
  safeStore,
feedbackStore,
netStore,
  serviceListStore,
  toolStore,
  loginPageStore,
  authStore,
};

ReactDOM.render((
  <LocaleProvider locale={zh_CN}>
    <Provider {...stores}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </LocaleProvider>
),
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();

import { action, observable } from 'mobx';
import { http } from '../../../utils';
import { message } from 'antd';

export class Item {
    @observable AddWhen: string = '';
    @observable AddWho: string = '';
    @observable ContractAmount: number = 0;
    @observable HasPayFee: number = 0;
    @observable IsReceive: number = 0;
    @observable OffMoney: number = 0;
    @observable OrderNo: string = '';
    @observable PayAccount: string = '';
    @observable PaymentAmount: number = 0;
    @observable PaymentDate: string = '';
    @observable PaymentMemo: string = '';
    @observable PaymentName: string = '';
    @observable PayType: string = '';
    @observable PaymentVoucher: string[] = [];
    @observable RefNo: string = '';
    @observable TotalOrderAmount: number = 0;
    @observable TradeStatus: string = '';
    @observable TransactionId: string = '';
    @observable TotalShippingFee: number = 0;
    @observable ReTime: string = '';
}


export class OrderChargeRecordsStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable OrderNo: string = '';

    // 分页配置
    @observable paging = {
        current: 1,
        total: 0,
        size: 10,
        onChange: (page: number) => {
            this.paging.current = page;
            this.getData();
        }
    }

    // 获取收款记录
    @action getData = async () => {
        this.loading = true;
        const res = await http.getRaw("console/order/pay" ,{OrderNo: this.OrderNo});
        this.loading = false;
        this.loading = false;
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        this.tableData = res.Data;
        this.paging.total = res.Data.length;  // 表格分页数据总数
    }

}

export const orderChargeRecordsStore = new OrderChargeRecordsStore();
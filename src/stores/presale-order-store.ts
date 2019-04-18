import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';
import * as moment from 'moment';


export class Item {
    @observable AddWhen: string = moment().format('YYYY-MM-DD');
    @observable ContractAmount: string = "";
    @observable ContractNo: string = "";
    @observable ContractQuantity: string = "";
    @observable ContractState: string = "";
    @observable HasPayFee: string = "";
    @observable InDate: string = "";
    @observable IsBidding: string = "";
    @observable IsOut: string = "";
    @observable MobileNumber: string = "";
    @observable OrderNo: string = "";
    @observable OrderState: string = "";
    @observable OrderType: string = "";
    @observable RealName: string = "";
    @observable ShippingFee: string = "";
    @observable UserId: string = "";
    @observable test: string = "";
    @observable OrderStateS: string = "";
    @observable NickName: string = "";
    @observable IsIncludeTax: string = '';
    @observable CouponId: string = '';
    @observable ClientName: string = '';
    @observable MOrderType: string = '';
    @observable CategoryBId: string = '';
    @observable GoodsKind: string = '';
    @observable PresellState: string = '';
    @observable RefundState: string = '';
    @observable GoodsName: string = '';
    @observable GoodsParamsExplain: string = '';
    @observable GoodsNumber: number = 0;
    @observable ProductPrice: number = 0;
}

export class Category {
    @observable AddWhen: string = '';
    @observable AddWho: string = '';
    @observable Advance: number = 0;
    @observable CategoryAId: string = '';
    @observable CategoryAName: string = '';
    @observable CategoryIcon: string = '';
    @observable CategoryId: string = '';
    @observable CategoryName: string = '';
    @observable ContractBTypeNoTax: string = '';
    @observable ContractBTypeTax: string = '';
    @observable DisCount: number = 0;
    @observable EditWhen: string = '';
    @observable EditWho: string = '';
    @observable FactoryIcon: string = '';
    @observable OnSale: string = '';
    @observable OrderTag: number = 0;
    @observable PresellAdvance: number = 0;
    @observable PresellContractBTypeNoTax: string = '';
    @observable PresellContractBTypeTax: string = '';
    @observable VipFee: number = 0;
}

export class RefundItem {
    @observable PaymentName: string = '';
    @observable PaymentAccount: string = '';
    @observable RefundState: string = '';
    @observable PaymentType: string = '';
    @observable PayType: string = '';
    @observable PaymentAmount: number = 0;
    @observable PaymentVoucher: string = '';
    @observable ContractNo: string = '';
    @observable AddWhen: string = '';
    @observable RefNo: string = '';
    @observable PaymentDate: string = '';
    @observable AddWho: string = '';
    @observable TradeNo: string = '';
    @observable EditWhen: string = '';
    @observable EditWho: string = '';
    @observable PaymentMemo: string = '';
    @observable PaymentTypeName: string = '';
    @observable TransactionId: string = '';
    @observable ReWho: string = '';
    @observable ReTime: string = '';
}

export class PresaleOrderStore {
    @observable tableData: Item[] = [];
    @observable key: string = '';
    @observable presellState: string = '';
    @observable IsIncludeTax: string = '';
    @observable ContractTemplate: any;
    @observable loading: boolean = false;
    @observable refundShow: boolean = false;
    @observable hasRefundShow: boolean = false;
    @observable detailShow: boolean = false;
    @observable currItem: Item = new Item();
    @observable curCategory: Category = new Category();
    @observable categoryList: any[] = [];
    @observable refundItems: RefundItem[] = [];
    @observable presaleState: string = '';
    @observable GoodsSeriesCode: string = '';
    @observable paymentTypes = ['线下支付', '快捷支付', '网银', '支付宝', '微信', '海尔'];
    @observable CategoryId: string = '';
    @observable CategoryIdList: any[] = [];
    @observable CategoryIds: string = '';
    @observable CategoryIdsList: any[] = [];


    @observable paging = {
        total: 0,
        current: 1,
        size: 10,
        onChange: (page: number) => {
            this.getData(page);
            this.paging.current = page;
        }
    }


    @action search = (t: any, l: any) => {
        this.key = t;// 搜索关键字
        this.presellState = l[0].check; // 额外选项
        this.CategoryId = l[1].check;
        if (this.CategoryId) {
            this.getCBData(this.CategoryId);
        }
        this.CategoryIds = l[2] ? l[2].check : '';
        this.paging.current = 1;
        this.getData();
    }

    @action close = () => {
        this.refundShow = false;
        this.hasRefundShow = false;
        this.detailShow = false;
    }

    @computed get list() {
        return this.tableData.map((it, index) => ({ ...it, index: index + 1, key: index }))
    }
    @action async getCAData() {
        this.CategoryIdList = [{ label: '全部', value: '' }];
        const res = await http.getRaw("web/category_a");
        if (res.ResultCode !== 0) {
            message.error(`请求错误：${res.ResultInfo}`);
            return;
        }
        res.Data.ResultList.forEach((si: any) => {
            this.CategoryIdList.push({
                label: si.CategoryName, value: si.CategoryId,
            });
        });
        // this.getCBData()
        // this.CategoryId = res.Data.ResultList[0].CategoryId;
    }
    @action async getCBData(id: any) {
        this.CategoryIdsList = [{ label: '全部', value: '' }];
        const res = await http.getRaw("web/category_b", { CategoryAId: id });
        if (res.ResultCode !== 0) {
            message.error(`请求错误：${res.ResultInfo}`);
            return;
        }
        res.Data.ResultList.forEach((si: any) => {
            this.CategoryIdsList.push({
                label: si.CategoryName, value: si.CategoryId,
            });
        });
        // this.CategoryId = res.Data.ResultList[0].CategoryId;
    }
    // 获取订单列表数据
    @action async getData(page: number = this.paging.current) {
        this.loading = true;
        const res = await http.getRaw("console/order", {
            State: 1,
            PageIndex: page,
            PageSize: 10,
            SearchContent: this.key,
            PresellState: this.presellState,
            GoodsKind: 1,
            ComGoodsKind: 0,
            CategoryBId: this.CategoryIds,
            CategoryAId: this.CategoryId,
            // RequestType: 1,
        });
        this.loading = false;
        if (res.ResultCode !== 0) {
            message.error(`请求错误：${res.ResultInfo}`);
            return;
        }
        this.tableData = res.Data.List;
        this.paging.total = res.Data.ResultCount;
    }

    @action async getOrderPay(id: any) {
        const res = await http.getRaw("console/order/pay", { OrderNo: id, });
        if (res.ResultCode !== 0) {
            message.error(`请求错误：${res.ResultInfo}`);
            return;
        }
        res.Data.forEach((rs: any) => {
            rs.PaymentTypeName = rs.PayType === '1' ? '支付宝' : (
                rs.PayType === '2' ? '微信' : '其他'
            )
        });
        this.refundItems = res.Data;
    }
    @action Refund = async () => {
        const data = await http.postRaw(`order/refund`, { OrderNo: this.currItem.OrderNo });
        if (data.ResultCode !== 0) {
            message.error(data.ResultInfo);
            return;
        }
        message.success("退款成功");
        this.getData();
        this.refundShow = false;
    }
}

export const presaleOrderStore = new PresaleOrderStore();

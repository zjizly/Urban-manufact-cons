import { action, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';
import { Utils } from '../utils/utils';
import * as moment from 'moment';

export class Item {
    @observable Address: string = '';
    @observable CompanyID: string = '';
    @observable DeliveryDate: string = '';
    @observable DesignUserId: string = '';
    @observable GoodsKind: string = '';
    @observable GoodsName: string = '';
    @observable GoodsNumber: number = 0;
    @observable GoodsPhoto: string = '';
    @observable GoodsSeriesPhotos: string[] =[];
    @observable HasPayFee: number = 0;
    @observable InDate: string = '';
    @observable IsIncludeTax: string = '';
    @observable IsPay: string = '';
    @observable IsPayBack: string = '';
    @observable IsUserGet: string = '';
    @observable MobileNumber: string = '';
    @observable NickName: string = '';
    @observable OrderNo: string = '';
    @observable OrderState: string = '';
    @observable StoreName: string = '';
    @observable TotalOrderAmount: number = 0;
    @observable TotalProductAmount: number = 0;
    @observable UserId: string = '';
    @observable YunNum: number = 0;
}

export class Record {
    @observable PaymentName: string = "";
    @observable PaymentAccount: string = "";
    @observable PaymentAmount: string = "";
    @observable PaymentVoucher: string[] = [];
    @observable ContractNo: string = "";
    @observable AddWhen: string = "";
    @observable RefNo: string = "";
    @observable PaymentDate: string = moment().format("YYYY-MM-DD");
    @observable AddWho: string = "";
    @observable EditWhen: string = "";
    @observable EditWho: string = "";
    @observable PaymentMemo: string = "";
    @observable PaymentType: string = "";
}



export class OrderChargeStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable categoryAId: string = '';
    @observable state: string = '';
    @observable CategoryId1: string = '';
    @observable CategoryId2: string = '';
    @observable CategoryAOptions: any[] = [{ label: '全部', value: '' }];
    @observable CategoryBOptions: any[] = [{ label: '全部', value: '' }];
    @observable orderStates: string[] = ["待付款", "待发货", "待收货", "已完成" ];


    @observable records: Record[] = [];
    @observable curRec: Record = new Record();
    @observable showRecords = false;

    @observable haspay: number = 0;
    @observable curCategory: any;
    @observable categoryList: any[] = [];

    // 分页配置
    @observable paging = {
        current: 1,
        total: 0,
        size: 10,
        onChange: (page: number) => {
            this.paging.current = page;
            this.getData(page);
        }
    }

    @action search = (t: any, l: any) => {
        this.key = t;// 搜索关键字
        this.state = l[0].check; // 额外选项
        this.CategoryId1 = l[1].check; 
        this.paging.current = 1;
        this.getCategoryB();
    }

    @action async getCategoryA() {
        const res = await http.getRaw(`web/category_a`,{});
        if( res.ResultCode !== 0 ) {
            message.error(res.ResultInfo);
            return;
        }
        this.CategoryAOptions = [{ label: '全部', value: '' }];
        res.Data.ResultList.map((it: any)=> this.CategoryAOptions.push({ label: it.CategoryName, value: it.CategoryId }))
        this.getCategoryB();
    }

    @action async getCategoryB() {
        const res = await http.getRaw(`web/category_b`,{CategoryAId: this.CategoryId1});
        if( res.ResultCode !== 0 ) {
            message.error(res.ResultInfo);
            return;
        }
        this.CategoryBOptions = [{ label: '全部', value: '' }];
        res.Data.ResultList.map((it: any)=> this.CategoryBOptions.push({ label: it.CategoryName, value: it.CategoryId }))
        this.getData();
    }

    @action handleChange = (s: string) => {
        this.CategoryId2 = s;  
        this.getData();
    }

    // 订单收款列表
    @action async getData(page: number = this.paging.current) {
        // console.log(this.curCategory);
        this.loading = true;
        const res = await http.getRaw("console/financeorder", {
            pageIndex: page,
            pageSize: 10,
            SearchContent: this.key,
            OrderState: this.state,
            CategoryId1: this.CategoryId1,
            CategoryId2: this.CategoryId2,
        });
        this.loading = false;
        const r = Utils.checkRes(res);
        if (!r.stat) {
            message.error("未获取到表格数据");
            return;
        }
        this.tableData = r.data.ResultList;
        this.paging.total = r.data.ResultCount;  // 表格分页数据总数
    }

    // 获取收款记录
    @action getRecords = async () => {
        this.haspay = 0;
        this.loading = true;
        const res = await http.getRaw("console/order/pay" ,{OrderNo: this.currItem.OrderNo});
        this.loading = false;
        const r = Utils.checkRes(res);
        if (r.stat) {
            // console.log(r);
            r.data.forEach((el: any) => {
                this.haspay += Number(el.PaymentAmount);
            });
            this.records = r.data;
            return;
        }
        message.warn("未获取到收款记录");
    }


}

export const orderChargeStore = new OrderChargeStore();
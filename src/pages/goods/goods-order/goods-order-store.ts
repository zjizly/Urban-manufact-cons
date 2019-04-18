import { action, computed, observable } from 'mobx';
import {  http } from '../../../utils';
import { message } from 'antd';

export class Item {
    @observable Address: string = '';
    @observable CategoryAId: string = '';
    @observable CompanyID: string = '';
    @observable DeliveryDate: string = '';
    @observable DesignUserId: string = '';
    @observable GoodsKind: string = '';
    @observable GoodsName: string = '';
    @observable GoodsNumber: number = 0;
    @observable GoodsSeriesPhotos: string = '';
    @observable HasPayFee: number = 0;
    @observable InDate: string = '';
    @observable IsIncludeTax: string = '';
    @observable MOrderType: string = '';
    @observable MobileNumber: string = '';
    @observable NickName: string = '';
    @observable OrderNo: string = '';
    @observable OrderState: string = '';
    @observable RealName: string = '';
    @observable RefundLog: any[] =[];
    @observable RefundState: string = '';
    @observable StoreName: string = '';
    @observable TotalOrderAmount: number = 0;
    @observable TotalProductAmount: number = 0;
    @observable TotalShippingFee: number = 0;
    @observable UserId: string = '';
}

export class Detail {
    @observable AddWhen: string = '';
    @observable AddWho: string = '';
    @observable Address: string = '';
    @observable DeliveryDate: string = '';
    @observable EditWhen: string = '';
    @observable EditWho: string = '';
    @observable GoodsName: string = '';
    @observable GoodsNumber: number = 0;
    @observable GoodsParamsExplain: string = '';
    @observable GoodsReName: string = '';
    @observable GoodsSeriesCode: string = '';
    @observable InDate: string = '';
    @observable NickName: string = '';
    @observable OrderNo: string = '';
    @observable ProductPrice: string = '';
    @observable RealName: string = '';
    @observable RefNo: string = '';
    @observable UserId: string = '';
}

export class GoodsOrderStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable detailShow: boolean = false;
    @observable GoodsSeriesCode: string = '';
    @observable OrderState: string = '';
    @observable detail: Detail = new Detail();

    
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

    @computed get list(){
        return this.tableData.map( (it, index) => ({ ...it, index: index+1, key: index }) )
    }
    @action search=(t: any, l: any)=>{
        this.key = t;// 搜索关键字
        this.OrderState = l[0].check; // 额外选项
        this.paging.current = 1;
        this.getData();
    }
    @action async getData(page: number = this.paging.current){
        this.loading = true;
        const res = await http.getRaw(
            `console/order`,
            {
                State: 2,
                PageIndex: page,
                PageSize: 10,
                SearchContent: this.key,
                ComGoodsKind: 1,
                // GoodsKind: 0,
                OrderState: this.OrderState,
                GoodsSeriesCode: this.GoodsSeriesCode,
                // RequestType: 1,
            }
        );
        this.loading = false;
        if( res.ResultCode !== 0 ) {
            message.error(res.ResultInfo);
            return;
        }
        this.tableData = res.Data.List;
        this.paging.total = res.Data.ResultCount;
    }

    @action getDetail = async () => {
        this.loading = true;
        const res = await http.getRaw(
            `console/goods/detail`,
            {
                OrderNo: this.currItem.OrderNo,
            }
        );
        this.loading = false;
        if( res.ResultCode !== 0 ) {
            message.error(res.ResultInfo);
            return;
        }
        this.detail = res.Data[0];
    }

    @action close =() =>{
        this.detailShow = false;
    }

}

export const goodsOrderStore = new GoodsOrderStore();
import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';

export class Item {
    @observable OrderState: string = "";
    @observable InDate: string = "";
    @observable OrderNo: string = "";
    @observable GoodsName: string = "";
    @observable GoodsNumber: string = "";
    @observable NickName: string = "";
    @observable RealName: string = "";
    @observable Address: string = "";
    @observable GoodsParamsExplain: string = "";
    @observable ProductPrice: string = "";
    @observable DeliveryDate: string = "";
}

export class ShipItem {
    @observable Address: string = '';
    @observable BillNo: string = '';
    @observable DeliveryDate: string = '';
    @observable ExpName: string = '';
    @observable GoodsNumber: number = 0;
    @observable Remark: string = '';
    @observable RowID: string = '';
    @observable UserId: string = '';
    @observable AddressItem :AddressItem;
}

export class AddressItem {
    @observable County: string = '';
    @observable UserId: string = '';
    @observable Province: string = '';
    @observable Address: string = '';
    @observable District: string = '';
    @observable UserName: string = '';
    @observable MobileNumber: string = '';
    @observable RefNo: string = '';
    @observable City: string = '';
}

export class OffOrderStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable detailShow: boolean = false;
    @observable shipShow: boolean = false;
    @observable OrderState: string = '';
    @observable CategoryId: string = '';
    @observable CategoryIdList: any[] = [];
    @observable CategoryIds: string = '';
    @observable CategoryIdsList: any[] = [];
    @observable currShipItem : ShipItem = new ShipItem();

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

    @computed get list() {
        return this.tableData.map((it, index) => ({ ...it, index: index + 1, key: index }))
    }
    @action close = () => {
        this.detailShow = false;
        this.shipShow = false;
    }
    @action search = (t: any, l: any) => {
        this.key = t;// 搜索关键字
        this.OrderState = l[0].check;
        this.CategoryId = l[1].check;
        if (this.CategoryId) {
            this.getCBData(this.CategoryId);
        }
        this.CategoryIds = l[2] ? l[2].check : '';
        this.paging.current = 1;
        this.getData();
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
    @action async getData(page: number = this.paging.current) {
        this.loading = true;
        const res = await http.getRaw("console/order", {
            State: 2,
            PageIndex: page,
            PageSize: 10,
            SearchContent: this.key,
            CategoryBId: this.CategoryIds,
            OrderState: this.OrderState,
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
    @action async getShipDetail() {
        const res = await http.getRaw('console/shipping/detail', {'OrderNo': this.currItem.OrderNo});
        if(res.ResultCode !== 0) {
            message.error(`请求错误:${res.ResultInfo}`);
            return;
         }
         this.currShipItem = res.Data;
         this.currShipItem.AddressItem = this.currShipItem.Address && JSON.parse(this.currShipItem.Address);
    }

}

export const offOrderStore = new OffOrderStore();
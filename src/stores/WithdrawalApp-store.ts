import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';
export class StaItem {
    ParamCode: string;
    ParamValue: string;
}
export class Item {
    @observable AccountBalance: number = 0;
    @observable CardId: string = '';
    @observable CashState: string = '';
    @observable CreateTime: string = '';
    @observable MobileNumber: string = '';
    @observable Money: number = 0;
    @observable RealName: string = '';
    @observable RefNo: string = '';
    @observable UserId: string = '';
    @observable UserType: string = '';
    @observable tbname: string = '';
}

export class SaveItem {
    RefNo: string;
    CashState: string;
    CashStatestr: string;
    CardAddress: string;
    CardName: string;
    CardId: string;
}

export class WithdrawalappStore {
    @observable tableData: Item[] = [];
    @observable StaData: StaItem[] = [];
    @observable loading: boolean = false;
    @observable Show: boolean = false;
    @observable CashState: string = '1';
    @observable key: string = '';
    @observable searchType: string = '';
    @observable currItem: SaveItem = new SaveItem();

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

    @action search = (t: any, l: any) => {
        this.key = t;// 搜索关键字
        this.paging.current = 1;
        this.getData();
    }

    @computed get list() {
        return this.tableData.map((it, index) => ({ ...it, index: index + 1, key: index }))
    }
   
    @action async getData() {
        this.loading = true;
        const data = await http.getRaw(`console/user/cash/out`, {
            PageIndex: this.paging.current,
            PageSize: this.paging.size,
            SearchContent: this.key,
            CashState: this.CashState,
        });
        this.loading = false;
        if (data.ResultCode !== 0) {
            message.error(data.ResultInfo);
            return;
        }
    
        this.tableData = data.Data.ResultList;
        this.paging.total = data.Data.ResultCount;
    }

    @action async StateChange() {
        // const res: any = await http.put(undefined, 'console/user/cash/out', {RefNo: this.currItem.RefNo, CashState: 2});
        // this.loading = false;
        // if (res.ResultCode === 0) {
            const res1: any = await http.post(undefined, 'console/alipaytransfer', {RefNo: this.currItem.RefNo});
            if(res1.ResultCode === 0) {
                this.getData();
                this.Show = false;
                message.success("审核完毕！");
                return;
            }   
        // }
        message.error("操作失败！" + res1.ResultInfo);
    }

    
}

export const withdrawalappStore = new WithdrawalappStore();
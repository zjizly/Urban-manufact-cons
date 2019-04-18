import { action, computed, observable } from 'mobx';
import { http } from '../../../utils';
import { message } from 'antd';

export class Item {
    @observable ViewList: string = '';
    @observable ViewLists: any[] = [];
    @observable EditTime: string = '';
    @observable BrandCulture: string = '';
}

export class BranchStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable code: string = '';
    @observable imageShow: boolean = false;
    @observable images: any[] = [];


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
        return this.tableData.map((it, index) => ({ ...it, index: index + 1, key: index }));
    }
    @action search = (t: any, l: any) => {
        this.key = t;// 搜索关键字
        // this.UserState = l[0].check; // 额外选项
        this.paging.current = 1;
        this.getData();
    }
    @action async getData(page: number = this.paging.current) {
        this.tableData = [];
        this.loading = true;
        const res = await http.getRaw(
            `console/designbrand`,
            {
                UserId: this.code,
            }
        );
        this.loading = false;
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        const n = (page - 1) * 10;
        res.Data.filter((rs: any) =>
            rs.BrandName.indexOf(this.key) !== -1 ||
            rs.BrandCulture.indexOf(this.key) !== -1).slice(n, page * 10).map((ts: any) => {
                if (ts.ViewList && JSON.parse(ts.ViewList)) {
                    ts.ViewLists = JSON.parse(ts.ViewList);
                } else {
                    ts.ViewLists = [];
                }
                this.tableData.push(ts);
            });
        this.paging.total = res.Data.length;
    }

}

export const branchStore = new BranchStore();
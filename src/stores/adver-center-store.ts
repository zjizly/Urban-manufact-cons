import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';

export class Item {
    @observable ADId: string = "";
    @observable ADUrl: string = "";
    @observable ADOrder: string = "";
    @observable ADSkipLink: string = "";
    @observable ADSkipLinkAndroid: string = "";
    @observable ADSkipLinkIos: string = "";
    @observable ADState: string = "";
    @observable BusinessCategory: string = "";
    @observable EditWhen: string = "";
    @observable ProductType: string = '0';
}

export class AdverCenterStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable edit: boolean = false;

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
        this.edit = false;
    }
    @action search = (t: any, l: any) => {
        this.key = t;// 搜索关键字
        this.paging.current = 1;
        this.getData();
    }
    @action del = (v: any) => async () => {
        const res = await http.delRaw(`console/adcenter`, { ADId: v.ADId });
        this.loading = false;
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        message.success('删除成功！');
        this.getData();
    }
    @action Save = async () => {
        const meth = this.currItem.ADId ? http.putRaw : http.postRaw;
        const res = await meth(`console/adcenter`, this.currItem);
        this.loading = false;
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        message.success('操作成功！');
        this.getData();
        this.edit = false;
    }
    @action async getData(page: number = this.paging.current) {
        this.loading = true;
        const res = await http.getRaw(
            `console/adcenter`,
            {
                PageIndex: page,
                PageSize: 10,
                SearchContent: this.key
            }
        );
        this.loading = false;
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        this.tableData = res.Data.ResultList;
        this.paging.total = res.Data.ResultCount;
    }

}

export const adverCenterStore = new AdverCenterStore();
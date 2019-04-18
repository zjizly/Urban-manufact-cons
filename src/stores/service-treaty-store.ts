import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';

export class Item {
    @observable Title: string = "";
    @observable ArticleClass: string = "0";
    @observable Content: string = "";
    @observable Sequence: string = "";
    @observable Display: string = "";
    @observable DeleteStatus: string = "";
    @observable ArticleID: string = "";
}

export class ServiceTreatyStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable edit: boolean = false;
    @observable isEdit: boolean = false;

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
        this.key = t;
        this.paging.current = 1;
        this.getData();
    }
    @action editTreaty = (s: string) => {
        this.currItem.Content = s;
    }
    @action Save = async () => {
        const meth = this.currItem.ArticleID ? http.putRaw : http.postRaw;
        const res = await meth(`console/servicearticle`, this.currItem);
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
            `console/servicearticle`,
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
        this.paging.total = res.Data.resultCount;
    }

}

export const serviceTreatyStore = new ServiceTreatyStore();
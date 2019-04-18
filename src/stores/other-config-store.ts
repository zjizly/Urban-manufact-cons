import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';

export class Item {
    @observable AddWhen: string = "";
    @observable AddWho: string = "";
    @observable ConfigCode: string = "";
    @observable ConfigContent: string = "";
    @observable ConfigType: string = "";
    @observable RefNo: string = "";
}


export class OtherConfigStore {

    @observable tableData: Item[] = [];
    @observable backup: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable mEdit = false;

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

    @action close = () => {
        this.mEdit = false;
    }

    checkRes(res: any): boolean {
        if (+(res.ResultCode) === 0) {
            this.getData();
            message.success("操作成功！");
            return false
        }
        message.error("操作失败：" + (res as any).ResultInfo);
        return true;
    }

    @computed get list() {
        return this.tableData.map((it, index) => ({ ...it, index: index + 1, key: index }));
    }
    @action SortBy = (arr: any[], str: string) => {
        arr.sort((a: any, b: any) => {
            return a[str] - b[str];
        });
    }
    @action async getData() {
        this.loading = true;
        const data = await http.getRaw("web/other/config",{
            PageSize: this.paging.size,
            PageIndex: this.paging.current,
        });
        this.loading = false;
        if (data.ResultCode !== 0) {
            message.error(data.ResultInfo);
            return;
        }
        // this.SortBy(data.Data, 'RefNo');
        this.tableData = data.Data.ResultList;
        this.backup = data.Data.ResultList;
        this.paging.total = data.Data.ResultCount;
    }

    @action submit = async () => {
        const data = {
            ConfigCode: this.currItem.ConfigCode,
            ConfigContent: this.currItem.ConfigContent
        }
        const res = await http.putRaw("web/other/config", data);
        this.mEdit = this.checkRes(res);
    }

}

export const otherConfigStore = new OtherConfigStore();
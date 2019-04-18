import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';

export interface Item {
    update_text: string,
    isNeedClearFMDB: string,
    app_version: string,
    app_type: string,
    is_update: string,
    is_payment: string,
    wechat_switch: string,
    alipay_switch: string,
    haier_switch: string,
    RefNo: string,
    app_name: string,
    apk_name: string,
    apk_url: string,
}

export class VersionControlStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item;
    @observable key: string = '';
    @observable mEdit: boolean = false;
    @observable look: boolean = false;
    @observable apkFileName: string = '';

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
    @action onEdit = (e: any) => {
        this.currItem.update_text = e.target.value;
    }
    @action close = () => {
        this.mEdit = false;
        this.look = false;
    }
    @action search = (t: any, l: any) => {
        this.key = t;// 搜索关键字
        this.paging.current = 1;
        this.getData();
    }
    @action submit = async () => {
        
        const data = { ...this.currItem };
        data.apk_url = data.apk_url;
        const metd = data.RefNo ? 'putRaw' : 'postRaw';
        const res = await http[metd]("web/app/version", data);
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        message.success('修改成功');
        this.mEdit = false;
        this.getData();
    }
    @action async getData(page: number = this.paging.current) {
        this.loading = true;
        const res = await http.getRaw(
            `console/app/version`,{SearchContent: this.key}
        );
        this.loading = false;
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        this.tableData = res.Data.ResultList;
        this.paging.total = res.Data.ResultCount;
        this.paging.size = res.Data.ResultCount;
    }

}

export const versionControlStore = new VersionControlStore();
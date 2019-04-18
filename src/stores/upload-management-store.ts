import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';

export class Item {
    @observable EditWhen: string = "";
    @observable UploadId: string = "";
    @observable FileName: string = "";
    @observable FileType: string = "";
    @observable Files: any = {
        name: '', url: ''
    };
}

export class UploadManagementStore {

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
    @action search = (t: any, l: any) => {
        this.key = t;// 搜索关键字
        this.paging.current = 1;
        this.getData();
    }
    @action close = () => {
        this.edit = false;
    }
    @action Save = async () => {
        console.log(this.currItem);
        // this.loading = true;
        // const res = await http.getRaw(`console/uploadfile`);
        // this.loading = false;
        // if (res.ResultCode !== 0) {
        //     message.error(res.ResultInfo);
        //     return;
        // }
        // this.tableData = res.Data.ResultList.filter((rs: any) => rs.FileName.indexOf(this.key) !== -1);
        // this.paging.total = res.Data.ResultCount;
        // this.paging.size = res.Data.ResultList.filter((rs: any) => rs.FileName.indexOf(this.key) !== -1).length;
    }
    @action async getData(page: number = this.paging.current) {
        this.loading = true;
        const res = await http.getRaw(`console/uploadfile`);
        this.loading = false;
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        this.tableData = res.Data.ResultList.filter((rs: any) => rs.FileName.indexOf(this.key) !== -1);
        this.paging.total = res.Data.ResultCount;
        this.paging.size = res.Data.ResultList.filter((rs: any) => rs.FileName.indexOf(this.key) !== -1).length;
    }

}

export const uploadManagementStore = new UploadManagementStore();
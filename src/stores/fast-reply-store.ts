import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';

export class Item {
    @observable Content: string = "";
    @observable EditWhen: string = "";
    @observable CategoryBId: string = "";
    @observable ProblemType: string = "";
    @observable RefNo: string = "";
}
export class Type {
    @observable ReplayType: string = "";
    @observable RefNo: string = "";
}

export class FastReplyStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable edit: boolean = false;
    @observable type: boolean = false;
    @observable typeList: Type[] = [];
    @observable typeLists: any[] = [];
    @observable types: Type = new Type();

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
        this.type = false;
    }
    @action search = (t: any, l: any) => {
        this.key = t;// 搜索关键字
        this.paging.current = 1;
        this.getData();
    }
    @action del = (id: any) => async () => {
        const res = await http.delRaw(`console/quickreplay`, { RefNo: id.RefNo });
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        };
        message.success('操作成功！');
        this.getData();
    }
    @action Save = async () => {
        const meth = this.currItem.RefNo ? http.putRaw : http.postRaw;
        const res = await meth(`console/quickreplay`, this.currItem);
        this.loading = false;
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        message.success('操作成功！');
        this.getData();
        this.edit = false;
    }
    @action submit = async () => {
        if (!this.types.ReplayType) {
            message.warn('请输入回复类型！');
            return;
        }
        const res = await http.postRaw(`console/addreplaytype`, this.types);
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        };
        this.type = false;
        this.getTypeData();
    }
    @action DelType = (id: any) => async () => {
        const res = await http.delRaw(`console/addreplaytype`, { RefNo: id });
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        };
        this.getTypeData();
    }
    @action getTypeData = async () => {
        this.typeLists = [];
        this.typeList = [];
        const res = await http.getRaw(`console/addreplaytype`);
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        this.typeList = res.Data;
        res.Data.forEach((rs: any) => {
            this.typeLists.push({ label: rs.ReplayType, value: rs.ReplayType });
        });
    }
    @action async getData(page: number = this.paging.current) {
        this.loading = true;
        const res = await http.getRaw(
            `console/quickreplay`,
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

export const fastReplyStore = new FastReplyStore();
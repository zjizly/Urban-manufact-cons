import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';

export class Item {
    @observable ReplyType: string = "";
    @observable ReplyContent: string = "";
    @observable HourStart: string = "00";
    @observable MinStart: string = "00";
    @observable HourEnd: string = "00";
    @observable MinEnd: string = "00";
    @observable EditWhen: string = "";
    @observable ReplyState: string = "";
}

export class AutoReplyStore {

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
    @action ChangeState = (id: any) => async () => {
        const res = await http.putRaw(`console/auto/reply/state`, {
            ReplyState: id.ReplyState === '0' ? '1' : '0',
            ReplyType: id.ReplyType,
        });
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        };
        message.success('修改成功！');
        this.getData();
    }
    @action del = (id: any) => async () => {
        const res = await http.delRaw(`console/auto/reply`, {
            CategoryBId: id.CategoryBId,
            ReplyType: id.ReplyType,
        });
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        };
        message.success('删除成功！');
        this.getData();
    }
    @action Save = async () => {
        if (!this.currItem.ReplyType) {
            message.warn('请选择回复类型！');
            return;
        }
        const meth = this.currItem.EditWhen ? http.putRaw : http.postRaw;
        const res = await meth(`console/auto/reply`, this.currItem);
        this.loading = false;
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        message.success('操作成功！');
        this.getData();
        this.edit = false;
    }
    @action search = (t: any, l: any) => {
        this.key = t;// 搜索关键字
        this.paging.current = 1;
        this.getData();
    }
    @action async getData(page: number = this.paging.current) {
        this.loading = true;
        const res = await http.getRaw(
            `console/auto/reply`,
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
        this.tableData = res.Data;
        this.paging.total = res.Data.length;
    }

}

export const autoReplyStore = new AutoReplyStore();
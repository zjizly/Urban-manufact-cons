import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';
import { ChangeEvent } from 'react';

export class Item {
    @observable AddWhen: string = "";
    @observable Content: string = "";
    @observable MobileNumber: string = "";
    @observable Photos: string[] = [];
    @observable RealName: string = "";
    @observable RefNo: string = "";
    @observable UserId: string = "";
}


export class FeedbackStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable mDetail = false;
    @observable searchContent: string = '';

    // 搜索配置
    searchCfg = {
        keyType: '0',
        key: '',
        searchHandler: (keyType: string, key: string) => {
            this.getData();
        }
    };

    // 搜索关键词选项
    keyTypes = [
        { val: '0', label: '手机号码' },
        { val: '1', label: '用户名' }
    ];

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

    checkRes(res: any): boolean {
        if (+(res.ResultCode) === 0) {
            this.getData(this.paging.current);
            message.success("操作成功！");
            return false
        }
        message.error("操作失败：" + (res as any).ResultInfo);
        return true;
    }

    @computed get list() {
        return this.tableData.map((it, index) => ({ ...it, key: it.RefNo, index: index + 1 }))
    }

    @action close = () => {
        this.mDetail = false;
    }
    @action searchChange = (e:ChangeEvent<HTMLInputElement>) => {
        this.searchContent = e.target.value;
        if(e.target.value==='') {
            this.getData();
        }
        if(/^1\d{10}$/.test(this.searchContent)) {
            this.searchCfg.keyType='0';
        } else {
            this.searchCfg.keyType='1';
        }
    }
    @action searchHandle = () => {
        this.getData();
    }

    @action async getData(page: number = this.paging.current) {
        this.loading = true;
        const res = await http.getRaw(`console/feedback`,
            {
                PageIndex: page,
                PageSize: 10,
                SearchType: this.searchCfg.keyType,
                SearchContent: this.searchContent
            }
        );
        this.loading = false;
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        res.Data.ResultList.forEach((it: any) => {
            it.Photos = it.Photos && JSON.parse(it.Photos);
        });
        this.tableData = res.Data.ResultList;
        this.paging.total = res.Data.ResultCount;  // 表格分页数据总数
    }

}

export const feedbackStore = new FeedbackStore();
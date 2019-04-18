import { action, computed, observable } from 'mobx';
import {  http } from '../../../utils';
import { message } from 'antd';

export class Item {
    @observable GoodsSeriesName: string = '';
    @observable StoreName: string = '';
    @observable EditWhen: string = '';
    @observable ParamName: string = '';
    @observable ParamId: string = '';
    @observable EditWho: string = '';
}

export class ParamStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable CategoryId: string = '';
    
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

    @computed get list(){
        return this.tableData.map( (it, index) => ({ ...it, index: index+1, key: index }) )
    }
    @action search=(t: any, l: any)=>{
        this.key = t;// 搜索关键字
       // this.UserState = l[0].check; // 额外选项
        this.paging.current = 1;
        this.getData();
    }

    @action async getData(page: number = this.paging.current){
        this.loading = true;
        const data = await http.getRaw(`web/make/params`,
            {
                CategoryId: this.CategoryId,
                SearchContent: this.key,
                PageIndex: page,
                PageSize: 10,
            }
        );
        this.loading = false;
        if (data.ResultCode !== 0) {
            message.error(data.ResultInfo);
            return;
        }
        this.tableData = data.Data.MakeParams;
        this.paging.total = data.Data.ResultCount;
    }

}

export const paramStore = new ParamStore();
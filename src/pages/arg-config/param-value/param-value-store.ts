import { action, computed, observable } from 'mobx';
import {  http } from '../../../utils';
import { message } from 'antd';

export class Item {
    @observable AddWhen: string = '';
    @observable AddWho: string = '';
    @observable EditWhen: string = '';
    @observable EditWho: string = '';
    @observable OrderTag: number = 0;
    @observable ParamAuditReason: string = '';
    @observable ParamOptionalAudit: string = '';
    @observable ParamOptionalIcon: string = '';
    @observable ParamOptionalId: string = '';
    @observable ParamOptionalName: string = '';
    @observable ParamName: string = '';
}

export class ParamValueStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable ParamId: string = '';
    
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
        const res = await http.getRaw(
            `web/make/params/optional`,
            {
                ParamId: this.ParamId,
                PageIndex: page,
                PageSize: 10,
                SearchContent: this.key
            }
        );
        this.loading = false;
        if( res.ResultCode !== 0 ) {
            message.error(res.ResultInfo);
            return;
        }
        this.tableData = res.Data.MakeParamsOptional ;
        this.paging.total = res.Data.TotalNumber; 
    }

}

export const paramValueStore = new ParamValueStore();
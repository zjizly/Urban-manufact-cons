import { action, computed, observable } from 'mobx';
import {  http } from '../utils';
import { message } from 'antd';

export class Item {
    @observable CompanyDesc: string = '';
    @observable CompanyID: string = '';
    @observable CompanyName: string = '';
    @observable CompanyViewList: string[] = [];
    @observable EditTime: string = '';
}

export class GoodPropsalStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable GoodsSeriesCode: string = '';
    @observable state: string = '';
    

    @computed get list(){
        return this.tableData.map( (it, index) => ({ ...it, index: index+1, key: index }) )
    }
   
    @action async getData(){
        this.loading = true;
        const res = await http.getRaw( `design/overviewcoopcompany`, {GoodsSeriesCode: this.GoodsSeriesCode,});
        this.loading = false;
        if( res.ResultCode !== 0 ) {
            message.error(res.ResultInfo);
            return;
        }
        console.log(res);
        this.tableData = res.Data;
    }

}

export const goodPropsalStore = new GoodPropsalStore();
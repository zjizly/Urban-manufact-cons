import { action, observable } from 'mobx';
 import {  http } from '../utils';
 import { message } from 'antd';


export class CommonDeleteItem{
    @observable DeleteRowID:string="";
    @observable Remark:string="";
}



export class CommonStore {
    @action delete =async (item:any) => {
        const { ResultCode, ResultInfo } = await http.post(undefined,`bidding/smartfactory/consoledatalogicaldelete`,item
        ) as any;
        if( ResultCode !== 0 ) {
            message.error( ResultInfo);
            return false;
        }else{
            message.success("删除成功！");
            return true;
        }
       
    };

}

export const commonStore = new CommonStore();
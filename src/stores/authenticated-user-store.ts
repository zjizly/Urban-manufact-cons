import { action, computed, observable } from 'mobx';
import {  http } from '../utils';
import { message } from 'antd';

export class Item {
    @observable AuthTime: string = '';
    @observable Company: string = '';
    @observable CreateTime: string = '';
    @observable HeadImageUrl:  string = '';
    @observable ID: string = '';
    @observable IsAudit: string = '';
    @observable IsCompany: string = '';
    @observable IsIdentity: string = '';
    @observable License: string[] = [];
    @observable MobileNumber: string = '';
    @observable NickName: string = '';
    @observable RealName: string = '';
    @observable Sex: string = '';
    @observable Tag: string = '';
    @observable UserId: string = '';
}

export class Info {
    @observable UpdateTime: string = '';
    @observable Region: string = '';
    @observable WeiXinNo: string = '';
    @observable UserId: string = '';
    @observable CreateUserID: string = '';
    @observable UpdateUserID: string = '';
    @observable BrandPic: string = '';
    @observable IsPersonal: string = '';
    @observable AuthState: string = '';
    @observable LicenseImg: string = '';
    @observable AuthTime: string = '';
    @observable AuthIdentity: string = '';
    @observable IsBusiness: string = '';
    @observable CreateTime: string = '';
    @observable City: string = '';
    @observable Province: string = '';
}

export class LabelInfo {
    @observable label: string = '';
}

export class AuthenticatedUserStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable time: string[] = [];
    @observable isLabelShow: boolean = false;
    @observable labels: string[] = [];
    @observable currLabel: LabelInfo = new LabelInfo();
    @observable IsBusiness: string = '';
    @observable RefNo: string = '';
    
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
        this.IsBusiness = l[0].check; // 额外选项
        this.paging.current = 1;
        this.getData();
    }
    @action async getData(page: number = this.paging.current){
        this.loading = true;
        const res = await http.getRaw(`console/appuser`,
            {
                PageIndex: page,
                PageSize: 10,
                SearchContent: this.key,
                IsBusiness: this.IsBusiness,
                StartAuthTime: this.time.length === 2 ? this.time[0] : '',
                EndAuthTime: this.time.length === 2 ? this.time[1] : ''
            }
        );
        this.loading = false;
        if( res.ResultCode !== 0 ) {
            message.error(res.ResultInfo);
            return;
        }
        this.tableData = res.Data.ResultList;
        this.paging.total = res.Data.ResultCount; 
    }

    @action change = () => {
        this.getData();
    }


    @action async getuserauthidlist() {
        const res = await http.getRaw(`console/audittag`,);
        if (res.ResultCode === 0) {
            this.labels = JSON.parse(res.Data[0].Tag);
            this.RefNo = res.Data[0].RefNo;
            return;
        }
        message.error(res.ResultInfo);
    }

    @action async saveLabels() {
        this.currLabel.label && this.labels.push(this.currLabel.label);
        const res = await http.postRaw(
            `console/audittag`,
            {
                Tag: JSON.stringify(this.labels),
                RefNo: this.RefNo,
            }
        );
        if (res.ResultCode === 0) {
            message.success('修改成功');
            this.getuserauthidlist();
            this.isLabelShow = false;
            this.currLabel.label = '';
            return;
        }
        message.error(res.ResultInfo);
    }

}

export const authenticatedUserStore = new AuthenticatedUserStore();
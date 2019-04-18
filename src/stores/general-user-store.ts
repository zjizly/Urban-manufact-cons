import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';

export class Item {
    @observable CreateTime: string = '';
    @observable HeadImageUrl: string = '';
    @observable MobileNumber: string = '';
    @observable NickName: string = '';
    @observable Sex: string = '';
}

export class LookItem {
    TelCell: string;
    VerificationCode: string;
}

export class GeneralUserStore {
    
    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable time: any[] = [];
    @observable UserLook: boolean = false;
    @observable lookuser: LookItem = new LookItem();



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
    @action async getData(page: number = this.paging.current) {
        this.loading = true;
        const res = await http.getRaw(`user/audit`,
            {
                PageIndex: page,
                PageSize: 10,
                SearchContent: this.key,
                CreateTimeStart: this.time.length === 2 ? this.time[0] : '',
                CreateTimeEnd: this.time.length === 2 ? this.time[1] : '', 
            }
        );
        this.loading = false;
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        this.tableData = res.Data.ResultList as any;
        this.paging.total = res.Data.ResultCount; 
    }

    @action change = () => {
        this.getData();
    }

    @action async Getverificationcode() {
        if (this.lookuser.TelCell !== '') {
            this.loading = true;
            const data = await http.getRaw(`web/verificationcode`, {
                MobileNumber: this.lookuser.TelCell,
            });
            if (data.ResultCode !== 0) {
                message.error(data.ResultInfo);
                return;
            }
            this.loading = false;
            this.lookuser.VerificationCode = data.Data.VerificationCode;
        } else {
            message.warn("请输入完整信息");
        }
    }
}

export const generalUserStore = new GeneralUserStore();
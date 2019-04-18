import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';

export class Img {
    @observable Url: string = '';
    @observable Name: string = '';
}

export class Item {
    @observable OrderTag: string = '';
    @observable Adress: string = '';
    @observable AuditReason: string = '';
    @observable AuditTime: string = '';
    @observable AuditUserID: string = '';
    @observable BrandCulture: string = '';
    @observable BrandName: string = '';
    @observable CategoryAId: string = '';
    @observable CheckCode: string = '';
    @observable CheckCodeState: string = '';
    @observable City: string = '';
    @observable CompanyName: string = '';
    @observable CreateTime: string = '';
    @observable CreateUserID: string = '';
    @observable DesignUserId: string = '';
    @observable District: string = '';
    @observable EditTime: string = '';
    @observable EditWho: string = '';
    @observable FailureTime: string = '';
    @observable HeadImageUrl: string = '';
    @observable ID: string = '';
    @observable IsStore: string = '';
    @observable MobileNumber: string = '';
    @observable Password: string = '';
    @observable Province: string = '';
    @observable RealName: string = '';
    @observable RowID: string = '';
    @observable SelfDesc: string = '';
    @observable StoreDesc: string = '';
    @observable StoreLogo: string = '';
    @observable StoreName: string = '';
    @observable StoreView: string = '';
    @observable UpdateTime: string = '';
    @observable UpdateUserID: string = '';
    @observable UserPosition: number = 0;
    @observable UserRole: string = '';
    @observable UserState: string = '';
    @observable UserType: string = '';
    @observable ViewList: any[] = [];
    @observable Work: string = '';
}

export class Review {
    @observable DesignUserId: string = '';
    @observable UserState: string = '1';
    @observable AuditReason: string = '';
}
export class DeUser {
    @observable DesignUserId: string = '';
    @observable OrderTag: string = '';
}

export class DesignerUserStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable currItems: DeUser = new DeUser();
    @observable key: string = '';
    @observable UserState: string = '';
    @observable shopdetailsShow: boolean = false;
    @observable reviewShow: boolean = false;
    @observable imageShow: boolean = false;
    @observable review: Review = new Review();
    @observable images: string[] = [];
    @observable sortShow: boolean = false;
    @observable isFault: boolean = false;


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
        this.UserState = l[0].check; // 额外选项
        this.paging.current = 1;
        this.getData();
    }
    @action async getData(page: number = this.paging.current) {
        this.loading = true;
        const res = await http.getRaw(
            `console/designuser`,
            {
                PageIndex: page,
                PageSize: 10,
                SearchContent: this.key,
                UserState: this.UserState
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

    @action close = () => {
        this.shopdetailsShow = false;
        this.reviewShow = false;
        this.imageShow = false;
        this.sortShow = false;
    }

    // 修改状态
    @action changeStat = (e: any) => {
        if (e !== '-1') {
            this.review.AuditReason = '';
        }
        this.review.UserState = e;
    }

    @action textChange = (e: any) => {
        this.review.AuditReason = e.target.value;
    }
    @action ordSub = async () => {
        const reg = /^\+?[1-9]\d*$/;
        if (!reg.test(this.currItems.OrderTag)) {
            message.warn('请输入正确排序不为0');
            return;
        }
        const res = await http.putRaw(`console/designordertag`, this.currItems);
        if (res.ResultCode === 0) {
            message.success('操作成功！');
            this.sortShow = false;
            this.getData();
        } else {
            message.error(res.ResultInfo);
        }

    }
    @action saveReview = async () => {
        if (this.review.UserState === '-1') {
            if (!this.review.AuditReason) {
                message.warn("信息填写不完整！");
                return;
            }
        }
        const res = await http.putRaw(`design/console/auditdesigner`, this.review);
        if (res.ResultCode === 0) {
            message.success("审核成功！");
            this.reviewShow = false;
            this.getData();
        } else {
            message.error("审核失败！" + res.ResultInfo);
        }

    }

}

export const designerUserStore = new DesignerUserStore();
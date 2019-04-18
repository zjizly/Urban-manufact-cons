import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';

export class Operate {
    @observable capacity: string = "";
    @observable categoryID: string = "";
    @observable imgUrl: string = "";
    @observable specCode: string = "";
    @observable unit: string = "";
}

export class Item {
    @observable AppointmentTime: string = "";
    @observable AuditReason: string = "";
    @observable CheckCodeState: string = "";
    @observable CompanyDesc: string = "";
    @observable CompanyID: string = "";
    @observable CompanyLicenseImg: string = "";
    @observable CompanyName: string = "";
    @observable CompanyState: string = "";
    @observable CompanyViewList: string = "";
    @observable ConsoleAuditTime: string = "";
    @observable ConsoleAuditWho: string = "";
    @observable CreateTime: string = "";
    @observable CreateUserID: string = "";
    @observable FailureTime: string = "";
    @observable FinAuditState: string = "";
    @observable ForeAuditState: string = "";
    @observable MainCategoryID: string = "";
    @observable MobileNumber: string = "";
    @observable RealName: string = "";
    @observable UpdateTime: string = "";
    @observable UpdateUserID: string = "";
    @observable UserID: string = "";
    @observable CategoryName: string = '';
    @observable Contacter: string = '';
    @observable CompanyAddress: string = '';
    @observable Certificate: string = '';
    @observable Report: string = '';
    @observable Authentication: string = '';
    @observable Quality: string = '';
    @observable CategoryIDList: any[] = [];
    @observable CompanyArea: string = '';
    @observable CompanyViewLists: any[] = [];
}

export class Review {
    @observable CompanyID: string = '';
    @observable CompanyState: string = '';
    @observable AuditReason: string = '';
}

export class Document {
    @observable name: string = '';
    @observable url: string = '';
}

export class AddCategory {
    @observable CompanyID: string = '';
    @observable CategoryIDList: string[] = [];
}

export class CompanyDocument {
    @observable RowID: string = '';
    @observable CompanyID: string = '';
    @observable Certificate: Document[] = [];
    @observable Report: Document[] = [];
    @observable Authentication: Document[] = [];
    @observable Quality: Document[] = [];
    @observable Picture: Document[] = [];
    @observable Remark: string = '';
    @observable Capacity: string = '';
}

export class CompanyDocumentInfo {
    @observable Picture: Document[] = [];
    @observable Remark: any = [];
    @observable Capacity: string = '';
    @observable Certificate: Document[] = [];
    @observable Authentication: Document[] = [];
    @observable Report: Document[] = [];
    @observable Quality: Document[] = [];
}

export class BiddingFactoryStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable CompanyState: string = '';
    @observable detailShow: boolean = false;
    @observable editShow: boolean = false;
    @observable filesShow: boolean = false;
    @observable reviewShow: boolean = false;
    @observable addCategoryShow: boolean = false;
    @observable review: Review = new Review();
    @observable currAddCategory: AddCategory = new AddCategory();
    @observable curCompanyDocument: CompanyDocument = new CompanyDocument();
    @observable categoryOptions: any[] = [];
    @observable Alist: any[] = [];
    @observable CAId: string = '';




    companyStateMap: any = {
        '0': '待申请',
        '1': '申请中',
        '2': '审核成功',
        '-2': '审核失败'
    };

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
        this.CAId = l[0].check;
        this.CompanyState = l[1].check; // 额外选项
        this.paging.current = 1;
        this.getData();
    }

    @action async getData(page: number = this.paging.current) {
        this.loading = true;
        const res = await http.getRaw(
            `console/factoryaudit`,
            {
                PageIndex: page,
                PageSize: 10,
                SearchContent: this.key,
                CompanyState: this.CompanyState,
                CategoryId: this.CAId,
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
    @action async getCategoryA() {
        this.Alist = [{ label: '全部', value: '' }];
        const res = await http.getRaw(`web/category_a`);
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        res.Data.ResultList.forEach((it: any) => this.Alist.push({ value: it.CategoryId, label: it.CategoryName }));
    }
    @action async getCategory() {
        const res = await http.getRaw(`web/category_b`, { CategoryAId: this.currItem.MainCategoryID });
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        // console.log(this.currItem.CategoryIDList);
        const tar: any = [];
        res.Data.ResultList.forEach((it: any) => tar.push({ value: it.CategoryId, label: it.CategoryName }));
        this.currItem.CategoryIDList.forEach((cs: any) => {
            tar.forEach((rl: any, dix: any) => {
                if (cs.CategoryID === rl.value) {
                    tar.splice(dix, 1);
                }
            });
        });
        // console.log(tar);
        this.categoryOptions = tar;
    }

    @action close = () => {
        this.detailShow = false;
        this.filesShow = false;
        this.reviewShow = false;
        this.addCategoryShow = false;
        this.editShow = false;
    }

    // 修改状态
    @action changeStat = (e: any) => {
        if (e.target.value === 2) {
            this.review.AuditReason = '';
        }
        this.review.CompanyState = e.target.value;
    }

    @action textChange = (e: any) => {
        this.review.AuditReason = e.target.value;
    }
    @action saveFiles = async () => {
        const data = {
            CompanyID: this.curCompanyDocument.CompanyID,
            Certificate: JSON.stringify(this.curCompanyDocument.Certificate),
            Report: JSON.stringify(this.curCompanyDocument.Report),
            Authentication: JSON.stringify(this.curCompanyDocument.Authentication),
            Quality: JSON.stringify(this.curCompanyDocument.Quality),
        }
        const res = await http.postRaw('console/uploadfactorydoc', data);
        if (!res.ResultCode) {
            message.success("上传验厂文件成功！");
            this.filesShow = false;
            this.getData();
            return;
        }
        message.error(res.ResultInfo);
    }

    @action addCategory = async () => {
        const res = await http.putRaw('console/addcategory', this.currAddCategory)
        if (res.ResultCode === 0) {
            message.success("新增品类成功！");
            this.addCategoryShow = false;
            this.getData();
            return;
        }
        message.error(res.ResultInfo);
    }

    @action saveReview = async () => {
        if (this.review.CompanyState === '-2') {
            if (!this.review.AuditReason) {
                message.warn("信息填写不完整！");
                return;
            }
        }
        const res = await http.putRaw(`factory/console/audit`, this.review);
        if (res.ResultCode === 0) {
            message.success("审核成功！");
            this.reviewShow = false;
            this.getData();
        } else {
            message.error(res.ResultInfo);
        }

    }
    @action editSub = async () => {
        const data = {
            CompanyID: this.currItem.CompanyID,
            MobileNumber: this.currItem.MobileNumber,
            CompanyLicenseImg: this.currItem.CompanyLicenseImg,
            CompanyName: this.currItem.CompanyName,
            Contacter: this.currItem.Contacter,
            CompanyArea: this.currItem.CompanyArea,
            CompanyAddress: this.currItem.CompanyAddress,
            CategoryList: this.currItem.CategoryIDList,
            CompanyDesc: this.currItem.CompanyDesc,
            CompanyViewList: this.currItem.CompanyViewList,
        }
        console.log(this.currItem, data);
        const res = await http.putRaw(`console/factoryaudit`, data);
        if (res.ResultCode === 0) {
            message.success("操作成功！");
            this.editShow = false;
            this.getData();
        } else {
            message.error(res.ResultInfo);
        }
    }

}

export const biddingFactoryStore = new BiddingFactoryStore();
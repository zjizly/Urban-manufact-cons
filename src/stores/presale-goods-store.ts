import { action, observable } from 'mobx';
import { http } from '../utils';
import { message, } from 'antd';
import { Utils } from '../utils/utils';
import * as services from '../services';
// import { authStore } from './user';

export class Item {
    @observable AddWhen: string = '';
    @observable AddWho: string = '';
    @observable AuditReason: string = '';
    @observable BrandCulture: string = '';
    @observable BrandID: string = '';
    @observable BrandName: string = '';
    @observable BrandViewList: ImageItem[] = [];
    @observable CategoryId: string = '';
    @observable CategoryId1: string = '';
    @observable CategoryId2: string = '';
    @observable CategoryId3: string = '';
    @observable CategoryName1: string = '';
    @observable CategoryName2: string = '';
    @observable CategoryName3: string = '';
    @observable ComGoodsKind: string = '';
    @observable CompanyID: string = '';
    @observable CompanyName: string = '';
    @observable ConsoleAudit: string = '';
    @observable ConsoleAuditWhen: string = '';
    @observable ConsoleAuditWho: string = '';
    @observable CoopNum: number = 0;
    @observable DepositRate: number = 0;
    @observable DesignDesc: string = '';
    @observable DesignFileList: ImageItem[] = [];
    @observable DesignRate: number = 0;
    @observable DesignState: string = '';
    @observable DesignUserId: string = '';
    @observable EditWhen: string = '';
    @observable EditWho: string = '';
    @observable EndTime: string = '';
    @observable GoodsKind: string = '';
    @observable GoodsSeriesAfterSale: string[] = [];
    @observable GoodsSeriesCode: string = '';
    @observable GoodsSeriesDetail: string[] = [];
    @observable GoodsSeriesKeywords: string = '';
    @observable GoodsSeriesMatch: string = '';
    @observable GoodsSeriesName: string = '';
    @observable GoodsSeriesParams: ParamItem[] = [];
    @observable GoodsSeriesQuality: string = '';
    @observable GoodsSeriesTitle: string = '';
    @observable GoodsSeriesUnit: string = '';
    @observable GoodsState: string = '';
    @observable GoodsSurfaceImg: string = '';
    @observable HasPresellNum: number = 0;
    @observable IsSetGoodsKind: string = '';
    @observable NowMarketNoTax: number = 0;
    @observable PresellNum: number = 0;
    @observable PresellState: string = '';
    @observable Products: ProductItem[] = [];
    @observable RealName: string = '';
    @observable SetNum: number = 0;
    @observable StoreName: string = '';
    @observable ViewList: ImageItem[] = [];
}

export class ProductItem {
    @observable AddWhen: string = '';
    @observable AddWho: string = '';
    @observable CategoryId: string = '';
    @observable EditWhen: string = '';
    @observable EditWho: string = '';
    @observable GoodsIcon: string = '';
    @observable GoodsParams: string[] = [];
    @observable GoodsParamsDict: any = null;
    @observable GoodsParamsExplain: string = '';
    @observable GoodsParamsMd5: string = '';
    @observable GoodsPhotos: string = '';
    @observable GoodsSeriesCode: string = '';
    @observable GoodsTitle:  string = '';
    @observable GoodsType: string = '';
    @observable MakeSale: number = 0;
    @observable MakeSource: string = '';
    @observable NowMarketNoTax: number = 0;
    @observable NowMarketTax: number = 0;
    @observable ParamOptionalIconList: string[] = [];
    @observable ProductId: string = '';
    @observable SetNum: number = 0;
}

export class ParamItem {
    @observable ParamValue: string = '';
    @observable OrderTag: number = 0;
    @observable ParamName: string = '';
}

export class ImageItem {
    @observable Url: string = '';
    @observable Name: string = '';
}

export class Sethaspresellnum{
    @observable GoodsSeriesCode: string = '';
    @observable HasPresellNum: string = '0';
    @observable SetHasPresellNum: number = 0;
}

interface ParamValue {
    ParamOptionalId: string;
    ParamOptionalName: string;
}
export interface Param {
    ParamType: '0' | '1';       // 1 下拉框 0 输入框
    ParamId: string;
    ParamName: string;
    ParamOptional: ParamValue[];
}
export class PresaleGoodsStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable PresellState: string = '';
    @observable GoodsState: string = '';
    @observable CategoryId1: string = '';
    @observable CategoryId2: string = '';
    @observable CategoryAOptions: any[] = [{ label: '全部', value: '' }];
    @observable CategoryBOptions: any[] = [{ label: '全部', value: '' }];


    @observable curCateC: services.CategoryB = { CategoryId: '', CategoryName: '' };
    @observable cateCs: any[] = [];
    @observable curSeries: services.Series | undefined;
    @observable showProgress: boolean = false;
    @observable programs: Item[] = [];
    @observable curCategory: any;
    @observable categoryList: any[] = [];
    @observable curProp: string = '';
    @observable curSethaspresell: Sethaspresellnum = new Sethaspresellnum();

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

    @action search = (t: any, l: any) => {
        this.key = t;// 搜索关键字
        this.PresellState = l[0].check; 
        this.GoodsState = l[1].check;
        this.CategoryId1 = l[2].check;
        this.paging.current = 1;
        this.getCategoryB();
    }

    @action close = () => {
        this.showProgress = false;
    }
    
    @action ShowEdit = (it: Item) => (row: any) => {
        this.showProgress = true;
        this.currItem = it
    }

   
  
    @action async getData(page: number = this.paging.current) {
        console.log(this.key);
        this.loading = true;
        const params: any = {
            PageIndex: page,
            PageSize: 10,
            SearchContent: this.key,
            CategoryId1: this.CategoryId1,
            CategoryId2: this.CategoryId2,
            PresellState: this.PresellState,
            GoodsState: this.GoodsState,
            GoodsKind: 1,
            // DesignState: 4,
        };
        const res = await http.getRaw("console/goodsmanage", params);
        const r = Utils.checkRes(res);
        this.loading = false;
        if (r.stat) {
            this.tableData = r.data.ResultList;
            this.paging.total = r.data.ResultCount;
            return
        }
        message.error("未获取到表格数据");
    }

    @action async getCategoryA() {
        const res = await http.getRaw(`web/category_a`,{});
        if( res.ResultCode !== 0 ) {
            message.error(res.ResultInfo);
            return;
        }
        this.CategoryAOptions = [{ label: '全部', value: '' }];
        res.Data.ResultList.map((it: any)=> this.CategoryAOptions.push({ label: it.CategoryName, value: it.CategoryId }))
        this.getCategoryB();
    }

    @action async getCategoryB() {
        const res = await http.getRaw(`web/category_b`,{CategoryAId: this.CategoryId1});
        if( res.ResultCode !== 0 ) {
            message.error(res.ResultInfo);
            return;
        }
        this.CategoryBOptions = [{ label: '全部', value: '' }];
        res.Data.ResultList.map((it: any)=> this.CategoryBOptions.push({ label: it.CategoryName, value: it.CategoryId }))
        this.getData();
    }

    @action handleChange = (s: string) => {
        this.CategoryId2 = s;  
        this.getData();
    }


    @action down = async () =>{
        const data = {
            GoodsSeriesCode: this.currItem.GoodsSeriesCode,
            GoodsKind: 1,
            GoodsState: 0,
        }

        const res = await http.putRaw("console/make/goods/state", data);
        const r = Utils.checkRes(res);
        if (r.stat) {
            this.getData();
            message.success("操作成功");
            return;
        }
        message.warn(r.info);
    }
}

export const presaleGoodsStore = new PresaleGoodsStore();
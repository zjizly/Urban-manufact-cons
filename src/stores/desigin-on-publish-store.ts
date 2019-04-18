import { action, computed, observable } from 'mobx';
import {  http } from '../utils';
import { message } from 'antd';

export class Item {
    @observable AddWhen: string = '';
    @observable AddWho: string = '';
    @observable AuditReason: string = '';
    @observable BrandCulture: string = '';
    @observable BrandID: string = '';
    @observable BrandName: string = '';
    @observable BrandViewList: any[] = [];
    @observable ViewList: any[] = [];
    @observable CategoryId: string = '';
    @observable CategoryId1: string = '';
    @observable CategoryId2: string = '';
    @observable CategoryId3: string = '';
    @observable CategoryName1: string = '';
    @observable CategoryName2: string = '';
    @observable CategoryName3: string = '';
    @observable ComGoodsKind: string = '';
    @observable CompanyID: string = '';
    @observable ConsoleAudit: string = '';
    @observable ConsoleAuditWhen: string = '';
    @observable ConsoleAuditWho: string = '';
    @observable CoopNum: number = 0;
    @observable DepositRate: number = 0;
    @observable DesignDesc: string = '';
    @observable DesignFileList: Document[] = [];
    @observable DesignRate: number = 0;
    @observable DesignState: string = '';
    @observable DesignUserId: string = '';
    @observable EditWhen: string = '';
    @observable EditWho: string = '';
    @observable EndTime: string = '';
    @observable GoodsKind: string = '';
    @observable GoodsSeriesAfterSale: any[] = [];
    @observable GoodsSeriesCode: string = '';
    @observable GoodsSeriesDetail: any[] = [];
    @observable GoodsSeriesKeywords: string = '';
    @observable GoodsSeriesMatch: string = '';
    @observable GoodsSeriesName: string = '';
    @observable GoodsSeriesParams: any[] = [];
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
    @observable Products: any[] = [];
    @observable SetNum: number = 0;
    @observable UserState: string = '';
    @observable StoreName: string = '';
    @observable RealName: string = '';
}

export class DesiginOnPublishStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable CategoryId1: string = '';
    @observable CategoryId2: string = '';
    @observable CategoryAOptions: any[] = [{ label: '全部', value: '' }];
    @observable CategoryBOptions: any[] = [{ label: '全部', value: '' }];
    
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
        this.CategoryId1 = l[0].check; // 额外选项
        this.paging.current = 1;
        this.CategoryId2 = '';
        this.getCategoryB();      
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

    @action async getData(page: number = this.paging.current){
        this.loading = true;
        const res = await http.getRaw(
            `console/goodsmanage`,
            {
                PageIndex: page,
                PageSize: 10,
                SearchContent: this.key,
                DesignState: 2,
                CategoryId1: this.CategoryId1,
                CategoryId2: this.CategoryId2, 
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

    @action handleChange = (s: string) => {
        this.CategoryId2 = s;  
        this.getData();
    }
}

export const desiginOnPublishStore = new DesiginOnPublishStore();
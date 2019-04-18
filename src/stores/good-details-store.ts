import { observable } from 'mobx';

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

export class GoodDetailsStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();    
 
  
   
}

export const goodDetailsStore = new GoodDetailsStore();
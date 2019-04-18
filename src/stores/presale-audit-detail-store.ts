import { action, observable } from 'mobx';


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
    @observable DesignFileList: ImageItem[] =[] ;
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
    @observable GoodsSeriesPhotos: string[] = [];
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
    @observable StoreName:  string = '';
    @observable ViewList: ImageItem[] = [];
    @observable SeriesParams: string = '';
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

export class PresaleAuditDetailStore {

    @observable info: Item | null = null;
    @observable loading: boolean = false;
    @observable cidMap: Map<string, string> = new Map();
    @observable tip: string = "暂无内容";
    @observable params: any = [];
    @observable value: any = [];
    @observable firstName = "";
    @observable Bid = "";
    @observable ShowList: any[] = [];

    @action fmtData(data: any) {
        try {
            data.GoodsSeriesPhotos = JSON.parse(data.GoodsSeriesPhotos);
            if (!data.GoodsSeriesPhotos) {
                data.GoodsSeriesPhotos = []
            }
        } catch (e) {
            data.GoodsSeriesPhotos = []
        }
       
        this.info = data;
    }

}

export const presaleAuditDetailStore = new PresaleAuditDetailStore();
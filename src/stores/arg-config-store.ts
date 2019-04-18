import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';

export class Item {
    @observable CategoryId: string = '';
    @observable CategoryName: string = '';
    @observable CategoryIcon: string = '';
    @observable BannerIcon: string = '';
    @observable ContractBTypeTax: string = '';
    @observable ContractBTypeNoTax: string = '';
    @observable PresellContractBTypeTax: string = '';
    @observable PresellContractBTypeNoTax: string = '';
    // @observable DepositRate: string = '';
    // @observable Advance: string = '';
    // @observable PresellAdvance: string = '';
    @observable OrderTag: number = 0;
    @observable OnSale: string = '1';
    @observable EditWho: string = '';
    @observable EditWhen: string = '';
    @observable DesignRateMin: string = '';
    @observable DesignRateMax: string = '';
}


export class ArgConfigStore {

    @observable currItem: Item = new Item();
    @observable sectableData: Item[] = [];
    @observable loading: boolean = false;
    @observable secKey = '';
    @observable downShow: boolean = false;
    @observable upShow: boolean = false;
    @observable onSale: string = '';
    @observable goodsnum: number = 0;

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

    search = (t: any, l: any) => {
        this.secKey = t;
        this.getData();
    };

    @computed get seclist() {
        return Boolean(this.sectableData.length) ? this.sectableData.map((it, index) => ({
            ...it,
            index: index + 1,
            key: this.paging.current === 1 ? index + 1 : (this.paging.current * this.paging.size + index + 1),
        })) : [];
    }

    @action async delCategorySec(it: Item) {
        const res = await http.delRaw(`web/category_a`, { CategoryId: it.CategoryId });
        if (res.ResultCode === 0) {
            message.success("删除成功！");
            this.getData();
            return;
        }
        message.error(`删除失败：${res.ResultInfo}`);
    }

    @action async getData(page: number = this.paging.current) {
        this.loading = true;
        const Result = await http.getRaw(`web/category_a`,
            {
                PageIndex: page,
                PageSize: 10,
                SearchContent: this.secKey,
            }
        );
        this.loading = false;
        if (Result.ResultCode !== 0) {
            message.error(Result.ResultInfo);
            return;
        }
        this.sectableData = Result.Data.ResultList as any;
        this.paging.total = Result.Data.ResultCount;
    }

    @action onlineChange = async () => {
        const data = await http.putRaw(
            `web/category_a/onsale`,
            {
                CategoryId: this.currItem.CategoryId,
                OnSale: this.currItem.OnSale === '1' ? '0' : '1',
            }
        );
        if (data.ResultCode !== 0) {
            message.error(data.ResultInfo);
            return;
        }
        message.success('修改成功！');
        this.close();
        this.getData();
    }

    @action close = () => {
        this.upShow = false;
        this.downShow = false;
    }

    @action async getGoodsnum() {
        const data = await http.getRaw(
            `web/category_a/goodsnum`,
            {
                CategoryId: this.currItem.CategoryId,
            }
        );
        if (data.ResultCode !== 0) {
            message.error(data.ResultInfo);
            return;
        }
        this.goodsnum = data.Data[0].ResultCount
    }

}

export const argConfigStore = new ArgConfigStore();
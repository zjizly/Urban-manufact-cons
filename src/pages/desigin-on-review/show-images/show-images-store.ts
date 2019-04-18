import { observable, action } from 'mobx';
import { message } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import { http } from 'src/utils';

export class Item {
    @observable ViewList: string = '';
    @observable CategoryId: string = '';
    @observable GoodsSeriesPhotos: string = '';
    @observable key: string = '';
}

export class Categorys {
    @observable categoryA: string = '';
    @observable categoryB: string = '';
    @observable categoryC: string = '';
}

export class ShowImagesStore {

    @observable dataList: Item[] = [];
    @observable loading: boolean = false;
    @observable CategoryAOptions: any[] = [];
    @observable CategoryBOptions: any[] = [];
    @observable CategoryCOptions: any[] = [];
    @observable curCategory: Categorys = new Categorys();
    @observable images: string[] = [];

    @action async getCategoryA() {
        const res = await http.getRaw("web/category_a", {});
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        this.CategoryAOptions = [];
        res.Data.ResultList.map((it: any) => this.CategoryAOptions.push({ label: it.CategoryName, value: it.CategoryId }))
        this.getCategoryB();
    }

    @action async getCategoryB(loadFirst: boolean = false) {
        const res = await http.getRaw("web/category_b", { CategoryAId: this.curCategory.categoryA });
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        this.CategoryBOptions = [];
        res.Data.ResultList.map((it: any) => this.CategoryBOptions.push({ label: it.CategoryName, value: it.CategoryId }));
        if (res.Data.ResultList.length > 0) {
            if(loadFirst) {
                this.curCategory = {
                    ...this.curCategory,
                    categoryB: res.Data.ResultList[0].CategoryId,
                }
            } 
            await this.getCategoryC(loadFirst);
        } else {
            this.CategoryCOptions = [];
            this.images = [];
        }
    }

    @action async getCategoryC(loadFirst: boolean = false) {
        const res = await http.getRaw("web/category_c", { CategoryBId: this.curCategory.categoryB });
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        this.CategoryCOptions = [];
        res.Data.ResultList.map((it: any) => this.CategoryCOptions.push({ label: it.CategoryName, value: it.CategoryId }))
        if (res.Data.ResultList.length > 0) {
            if(loadFirst) {
                this.curCategory.categoryC = res.Data.ResultList[0].CategoryId;
            }
            this.getImages();
        } else {
            this.images = [];
        }

    }

    @action handleChange = (s: string) => {
        this.curCategory.categoryA = s;
        this.getCategoryB(true);
    }

    @action handleChange1 = (e: RadioChangeEvent) => {
        this.curCategory.categoryB = e.target.value;
        this.getCategoryC(true);
    }

    @action handleChange2 = (e: RadioChangeEvent) => {
        this.curCategory.categoryC = e.target.value;
        this.getImages();
    }

    @action async getImages() {

        const res = await http.getRaw("console/pictureaudit", {
            CategoryId1: this.curCategory.categoryA,
            CategoryId2: this.curCategory.categoryB,
            CategoryId3: this.curCategory.categoryC
        });
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        this.dataList = res.Data.ResultList;
        this.images = [];
        this.dataList.map((it: Item) => {
            it.GoodsSeriesPhotos && JSON.parse(it.GoodsSeriesPhotos).map((it1: any) => this.images.push(it1.Url));
            it.ViewList && JSON.parse(it.ViewList).map((it1: any) => this.images.push(it1.Url))
        })

    }

}

export const showImagesStore = new ShowImagesStore();
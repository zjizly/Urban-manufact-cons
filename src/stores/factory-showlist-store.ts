import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';

export class Item {
    @observable FactoryId: string = "";
    @observable FactoryName: string = "";
    @observable CategoryBId: string = "";
    @observable MainCore: string = "";
    @observable FactoryImage: string = "";
    @observable Capacity: string = "";
    @observable OrderQ: string = "";
    @observable AmountMon: string = "";
    @observable FactoryAddress: string = "";
    @observable Longitude: string = "";
    @observable Latitude: string = "";
    @observable CategoryBName: string = "";
}

export class FactoryShowlistStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable curCategory: any = { CategoryId: '' };
    @observable categoryList: any[] = [];
    @observable visible: boolean = false;
    @observable show: boolean = false;
    @observable title: string = '';
    @observable name: string = '导入Excel';

    // 搜索配置
    searchCfg = {
        key: '',
        searchHandler: (key: string) => {
            this.getData(this.curCategory);
        }
    };

    // 分页配置
    @observable paging = {
        current: 1,
        total: 0,
        size: 10,
        onChange: (page: number) => {
            this.paging.current = page;
            this.getData(this.curCategory);
        }
    }

    @computed get list() {
        return this.tableData.map((it, index) => ({ ...it, index: index + 1, key: index }));
    }

    @action async getData(id: any, page: number = this.paging.current) {
        this.loading = true;
        const data = await http.getRaw(
            `console/hengshuirollingfaclist`,
            {
                pageIndex: page,
                pageSize: 10,
                CategoryBId: id.CategoryId,
                // CategoryBId:
                SearchContent: this.searchCfg.key
            }
        );
        this.loading = false;
        if (data.ResultCode !== 0) {
            message.warn(data.ResultInfo);
            return;
        }
        // console.log(data.Data);
        this.tableData = data.Data.ResultList;
        this.paging.total = data.Data.ResultCount;
    }
    @action onLoaded = async (list: any[]) => {
        this.curCategory = list[0] || null;
        this.categoryList = list;
        this.getData(this.curCategory);
    }
    @action changeCategory = (it: any) => {
        this.curCategory = it;
        this.getData(this.curCategory);
    }
    @action onClose = () => {
        this.visible = !this.visible;
    }
    @action Show = () => {
        this.show = !this.show;
        if (this.show) {
            this.name = '导入Excel';
        }
    }
    @action Add = (e?: any) => {
        if (e) {
            this.title = '编辑';
            this.currItem = e;
        } else {
            this.title = '新建';
            this.currItem = new Item();
        }
        this.visible = true;
    }
    @action Save = async () => {
        this.currItem.CategoryBId = this.curCategory.CategoryId;
        this.currItem.CategoryBName = this.curCategory.CategoryName;
        const meth = this.currItem.FactoryId ? await http.putRaw(`console/hengshuirollingfaclist`, this.currItem) :
            await http.postRaw(`console/hengshuirollingfaclist`, [this.currItem]);
        const data = meth;
        if (data.ResultCode !== 0) {
            message.warn(data.ResultInfo);
            return;
        }
        message.success('操作成功');
        this.visible = false;
        this.getData(this.curCategory);
    }
    @action del = async (e: any) => {
        const data = await http.delRaw(`console/hengshuirollingfaclist`, '', [e.FactoryId]);;
        if (data.ResultCode !== 0) {
            message.warn(data.ResultInfo);
            return;
        }
        message.success('操作成功');
        this.getData(this.curCategory);
    }
    @action SaveExcel = async (list: any) => {
        const tar: any[] = [];
        list.splice(0, 1);
        list.forEach((ls: any) => {
            tar.push({
                FactoryName: ls[0],
                CategoryBId: this.curCategory.CategoryId,
                MainCore: ls[1],
                FactoryImage: "excel无图片",
                Capacity: ls[2],
                OrderQ: ls[3],
                AmountMon: ls[4],
                FactoryAddress: ls[5],
                Longitude: ls[6],
                Latitude: ls[7],
                CategoryBName: this.curCategory.CategoryName,
            });
        });
        const data = await http.postRaw(`console/hengshuirollingfaclist`, tar);
        if (data.ResultCode !== 0) {
            message.warn(data.ResultInfo);
            return;
        }
        message.success('操作成功');
        this.show = false;
        this.name = '导入Excel';
        this.getData(this.curCategory);
    }
}

export const factoryShowlistStore = new FactoryShowlistStore();
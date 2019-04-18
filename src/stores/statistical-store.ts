import { action, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';

export class SaleroomStatistics {
    @observable CategoryBId: string = '';
    @observable CategoryBName: string = '';
    @observable Region: string = '未输入地区';
    @observable Longitude: number = 0;
    @observable Latitude: number = 0;
    @observable DataType: string = '';
    @observable VipSum: number = 0;
    @observable VipCurMonAdd: number = 0;
    @observable VipRate: number = 0;
    @observable VipIntervalM: number = 0;
    @observable VipAddNum: number = 0;
    @observable SaleSum: number = 0;
    @observable SaleCurMonAdd: number = 0;
    @observable SaleRate: number = 0;
    @observable SaleIntervalM: number = 0;
    @observable SaleAddNum: number = 0;
    @observable WorkShopSum: number = 0;
    @observable WorkShopCurMonAdd: number = 0;
    @observable WorkShopRate: number = 0;
    @observable WorkShopIntervalM: number = 0;
    @observable WorkShopAddNum: number = 0;
    @observable isAdd: boolean = false;
}

export class StatisticalStore {

    @observable tabeData: any[] = [];
    @observable loading: boolean = false;
    @observable Type: string = '0';
    @observable ShowTable: SaleroomStatistics[] = [];
    @observable AllTable: SaleroomStatistics[] = [];
    @observable curItem: SaleroomStatistics = new SaleroomStatistics();


    @action ChangeType = (e: any) => {
        this.Type = e.target.value;
        this.getData();
        // this.getCate();
    }
    @action async getData() {
        this.ShowTable = [];
        this.loading = true;
        const data = await http.getRaw(`console/hengshuivirshowconfignew`);
        this.loading = false;
        if (data.ResultCode !== 0) {
            message.warn(data.ResultInfo);
            return;
        }
        // data.Data.forEach((ds: any) => {
        //     this.AllTable.forEach((si: any, idx: any) => {
        //         if (si.CategoryBId === ds.CategoryBId && si.DataType === ds.DataType) {
        //             this.AllTable.splice(idx, 1, ds);
        //         }
        //     });
        // });
        this.AllTable = data.Data;
        this.ShowTable = this.AllTable.filter((ds: any) => ds.DataType === this.Type);
        // console.log(this.ShowTable);
    }
    // @action async getCate() {
    //     this.AllTable = [];
    //     this.loading = true;
    //     const data = await http.getRaw(`web/category_b`);
    //     this.loading = false;
    //     if (data.ResultCode !== 0) {
    //         message.warn(data.ResultInfo);
    //         return;
    //     }
    //     this.tabeData = data.Data.filter((ds: any) => ds.OnSale === '1');
    //     this.tabeData.forEach((ts: any) => {
    //         const s = new SaleroomStatistics();
    //         const d = new SaleroomStatistics();
    //         s.CategoryBId = ts.CategoryId;
    //         s.CategoryBName = ts.CategoryName;
    //         s.DataType = '0';
    //         d.CategoryBId = ts.CategoryId;
    //         d.CategoryBName = ts.CategoryName;
    //         d.DataType = '1';
    //         this.AllTable.push(s);
    //         this.AllTable.push(d);
    //     });
    //     const si = new SaleroomStatistics();
    //     const di = new SaleroomStatistics();
    //     si.CategoryBId = '123456';
    //     si.DataType = '0';
    //     di.CategoryBId = '123456';
    //     di.DataType = '1';
    //     this.AllTable.push(si);
    //     this.AllTable.push(di);
    //     this.getData();
    // }
    @action Save = async () => {
        for (let i = 0; i < this.ShowTable.length; i++) {
            const it = this.ShowTable[i];
            if (it.isAdd && it.CategoryBName === '') {
                message.warn("请填写品类名称");
                return;
            }
        }
        const data = await http.postRaw(`console/hengshuivirshowconfignew`, this.ShowTable);
        if (data.ResultCode !== 0) {
            message.warn(data.ResultInfo);
            return;
        }
        message.success('提交成功！');
        // this.getCate();
        this.getData();
    }
    @action Reset = async () => {
        const data = this.AllTable.filter((ds: any) => ds.DataType === '1');
        data.forEach((ds: any) => {
            ds.DataType = '0';
        });
        const res = await http.postRaw(`console/hengshuivirshowconfignew`, data);
        if (res.ResultCode !== 0) {
            message.warn(res.ResultInfo);
            return;
        }
        message.success('恢复成功！');
        // this.getCate();
        this.getData();
    }
    @action del = async () => {
        const res = await http.delRaw('console/hengshuivirshowconfignew', { CategoryBId: this.curItem.CategoryBId, DataType: this.curItem.DataType });
        if (res.ResultCode !== 0) {
            message.warn(res.ResultInfo);
            return;
        }
        message.success('删除成功');
        // this.getCate();
        this.getData();
    }

}

export const statisticalStore = new StatisticalStore();
import { action, observable } from 'mobx';
import {  http } from '../../../utils';
import { message } from 'antd';

export class Item {
    @observable CategoryName: string = '';
    @observable CategoryId: string = '';
    @observable CategoryIcon: string = '';
    @observable BannerIcon: string = '';
    @observable ContractBTypeTax: string = '';
    @observable ContractBTypeNoTax: string = '';
    @observable PresellContractBTypeTax: string = '';
    @observable PresellContractBTypeNoTax: string = '';
    // @observable DepositRate: string = '0';
    // @observable Advance: string = '0';
    // @observable PresellAdvance: string = '0';
    @observable OrderTag: number = 1;
    @observable DesignRateMinValue: number = 0;
    @observable DesignRateMaxValue: number = 0;
    @observable DesignRateMin: number = 0;
    @observable DesignRateMax: number = 0;
    @observable CategoryIconArray: string[] = [];
    @observable BannerIconArray: string[] = [];
}

export class ArgConfigEditStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable mTitle: string = '';

    checkData = () => {
       
        if (!this.currItem.CategoryName) {
            message.warn('请输入行业分类');
            return false;
        }
        if (!this.currItem.CategoryIconArray[0]) {
            message.warn('请输入分类图片');
            return false;
        }
        if (!this.currItem.BannerIconArray[0]) {
            message.warn('请输入轮播图');
            return false;
        }
        if (!this.currItem.ContractBTypeTax) {
            message.warn('请输入订单编号(含税)');
            return false;
        }
        if (!this.currItem.ContractBTypeNoTax) {
            message.warn('请输入订单编号(不含税)');
            return false;
        }
        if(!this.currItem.PresellContractBTypeTax) {
            message.warn('请输入众测订单编号(含税)');
            return false;
        }
        if(!this.currItem.PresellContractBTypeNoTax) {
            message.warn('请输入众测订单编号(不含税)');
            return false;
        }
        // if(this.currItem.DepositRate ==='' || Number(this.currItem.DepositRate)  < 0) {
        //     message.warn('请输入众测订单定金比例');
        //     return false;
        // }
        // if (this.currItem.Advance === '' || Number(this.currItem.Advance) < 0) {
        //     message.warn('请输入正确的常规订单预付款比例');
        //     return false;
        // }
        // if(this.currItem.PresellAdvance === '' || Number(this.currItem.PresellAdvance) < 0) {
        //     message.warn('请输入正确的众测订单预付款比例');
        //     return false;
        // }
        if (!this.currItem.OrderTag) {
            message.warn('请输入排序');
            return false;
        }

        const str = /^(\d|[1-9]\d|100)(\.\d+)?%$/;
        if (!str.test(String(this.currItem.DesignRateMinValue))) {
            message.warn('设计师分成比例最小值请输入1~100的百分数');
            return false;
        }
        if (!str.test(String(this.currItem.DesignRateMaxValue))) {
            message.warn('设计师分成比例最大值请输入1~100的百分数');
            return false;
        }
        if (this.toPoint(String(this.currItem.DesignRateMinValue)) > this.toPoint(String(this.currItem.DesignRateMaxValue))) {
            message.warn('设计师分成比例最大值应大于最小值');
            return false;
        }
        return true;
    }

    @action toPoint = (percent: string) => {
        const str=percent.replace("%",""); 
        return Number(str)/100;;
    }
  
    @action toPercent = (point: number) => {
        const str=Number(point*100);
        return `${str}%`;
    }

    @action async editSec() {
        this.loading = true;
        this.currItem.CategoryIcon = this.currItem.CategoryIconArray[0];
        this.currItem.BannerIcon = this.currItem.BannerIconArray[0]
        this.currItem.OrderTag = Number(this.currItem.OrderTag);
        this.currItem.DesignRateMin = this.toPoint(String(this.currItem.DesignRateMinValue));
        this.currItem.DesignRateMax = this.toPoint(String(this.currItem.DesignRateMaxValue));
        
        if (this.mTitle === "编辑分类") {
            if(this.checkData()) {
                
                const res: any = await http.putRaw('web/category_a', this.currItem);
                this.loading = false;
                if (res.ResultCode === 0) {
                    message.success("编辑成功！");
                    sessionStorage.removeItem("item");
                    window.history.go(-1)
                    return;
                }
                message.error("操作失败！" + res.ResultInfo);
            }
             
        } else {
            if(this.checkData()) {
                delete this.currItem.CategoryId;
                const res: any = await http.postRaw('web/category_a', this.currItem);
                this.loading = false;
                if (res.ResultCode === 0) {
                    message.success("新增成功！");
                    sessionStorage.removeItem("item");
                    window.history.go(-1);
                    return;
                }
                message.error("操作失败！" + res.ResultInfo);
            }  
        }
    }

}

export const argConfigEditStore = new ArgConfigEditStore();
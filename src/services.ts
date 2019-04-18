import { http } from './utils';
import { message } from 'antd';
import { Utils } from './utils/utils';

export interface CategoryB {
    CategoryId: string;
    CategoryName: string;
}

export interface Series {
    GoodsSeriesCode: string;
    GoodsSeriesName: string;
}

export interface CategoryC {
    CategoryId: string;
    CategoryName: string;
    GoodsQuality: string;
    GoodsAfterSale: string;
}

// 不改变数组变量的指针清空数组
function empty<T>(arr: T[]) {
    while (arr.length > 0) {
        arr.splice(0, 1);
    }
}

// 主分类
export async function cateB(list: CategoryB[]) {
    const res = await http.getRaw("web/factory/categorys_b");
    const r = Utils.checkRes(res);
    if (r.stat) {
        empty(list);
        r.data.forEach((it: any) => {
            list.push(it)
        })
        return
    }
    message.warn("未获取到二级分类")
}

// 获取三级分类
export async function cateC(bid: string, list: CategoryC[]) {
    const res = await http.getRaw("web/category_c?CategoryBId=" + bid);
    const r = Utils.checkRes(res);
    if (r.stat) {
        empty(list);
        r.data.forEach((it: any) => {
            list.push(it)
        })
        return
    }
    message.warn("未获取到三级分类")
}
export async function seriesi(cid: string, list: Series[]) {
    const res = await http.getRaw("web/category/series?CategoryId=" + cid);
    const r = Utils.checkRes(res);
    if (r.stat) {
        empty(list);
        r.data.forEach((it: any) => {
            list.push(it)
        })
        return
    }
    message.warn("未获取到商品系列")
}
// 获取商品系列
export async function series(cid: string, list: Series[], num?: any) {
    // const res = await http.getRaw("web/category/series?IsStandard=1&IsComplete=1&CategoryId=" + cid);
    const res = await http.getRaw("web/category/series", {
        IsStandard: num ? num : '1',
        IsComplete: 1,
        CategoryId: cid,
    });
    const r = Utils.checkRes(res);
    // console.log(res);
    if (r.stat) {
        empty(list);
        r.data.forEach((it: any) => {
            if (num) {
                if (it.IsStandard === '0') {
                    list.push(it);
                }
            } else {
                if (it.IsStandard === '1') {
                    list.push(it);
                }
            }

        })
        return
    }
    message.warn("未获取到商品系列")
}

// 获取设计品商品系列
export async function seriesS(cid: string, list: Series[]) {
    const res = await http.getRaw("web/category/series?IsStandard=0&IsComplete=1&CategoryId=" + cid);
    const r = Utils.checkRes(res);
    // console.log(res);
    if (r.stat) {
        empty(list);
        r.data.forEach((it: any) => {
            list.push(it)
        })
        return
    }
    message.warn("未获取到商品系列")
}
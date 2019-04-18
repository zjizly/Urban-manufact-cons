import { observable, action } from "mobx";


interface Res {
    stat: boolean;
    info: string;
    data: any
}

function checkRes(res: any): Res {
    if (res.ResultCode === 0) {
        return {
            stat: true,
            info: res.ResultInfo,
            data: res.Data
        }
    }
    return {
        stat: false,
        info: res.ResultInfo,
        data: null
    }
}

function cut(str: string, n?: number): string {
    if (!n) {
        n = 20;
    }
    if (!str) {
        return '';
    }
    if (str.length <= n) {
        return str;
    }
    str = str.substring(0, n - 1);
    str += "..."
    return str;
}

export const Utils = {

    checkRes,
    cut


}

export class Paging {

    @observable current: number = 1;
    @observable total: number = 0;
    @observable size: string = '10';
    callback: (p: number) => void;
    constructor(total?: number, cb?: (p: number) => void) {
        if (cb) {
            this.callback = cb;
        }
        if (total) {
            this.total = total;
        }
    }

    @action onChange = (page: number) => {
        this.current = page;
        if (this.callback) {
            this.callback(page);
        }
    }
}
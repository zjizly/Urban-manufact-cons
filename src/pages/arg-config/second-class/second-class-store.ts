import { action, computed, observable } from 'mobx';
import {  http } from '../../../utils';
import { message } from 'antd';

export class Item {
    @observable CategoryName: string = '';
    @observable CategoryIcon: string = '';
    @observable ParentCategoryId: string = '';
    @observable OrderTag: string = '';
    @observable ParentCategoryName: string = '';
    @observable CategoryId: string = '';
    @observable CategoryIconArray: string[] = [];
    @observable EditWhen: string = '';
    @observable EditWho: string = '';
}

export class SecondClassStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable mTitle: string = '';
    @observable eVisible: boolean = false;
    @observable CategoryId: string = '';
    @observable CategroyName: string = '';
   
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
       // this.UserState = l[0].check; // 额外选项
        this.paging.current = 1;
        this.getData();
    }

    @action async getData(page: number = this.paging.current){
        this.loading = true;
        const Result = await http.getRaw( `web/category_c`,
            {
                PageIndex: page,
                PageSize: 10,
                SearchContent: this.key,
                CategoryBId: this.CategoryId,
            }
        );
        this.loading = false;
        if( Result.ResultCode !== 0 ) {
            message.error(Result.ResultInfo);
            return;
        }
        this.tableData = Result.Data.ResultList as any; 
        this.paging.total = Result.Data.ResultCount;
    }

    @action checkDatas(d: any) {
        let success = true;
        for (const idx in d) {
            if (idx) {
                if (!d[idx] && idx === 'CategoryName') {
                    message.warn("信息填写不完整！");
                    this.loading = false;
                    success = false;
                    return
                }
                if (!d[idx] && idx === 'CategoryIcon') {
                    message.warn("信息填写不完整！");
                    this.loading = false;
                    success = false;
                    return
                }
                if (!d[idx] && idx === 'OrderTag') {
                    message.warn("信息填写不完整！");
                    this.loading = false;
                    success = false;
                    return
                }
            }
        }
        return success;
    }

    @action async editTri() {
        const str = this.mTitle;
        this.loading = true;
        if (str === "编辑品类") {
            const data = {
                OrderTag: this.currItem.OrderTag,
                CategoryId: this.currItem.CategoryId,
                CategoryName: this.currItem.CategoryName,
                CategoryIcon: this.currItem.CategoryIconArray[0],
            }
            if (this.checkDatas(data)) {
                const res: any = await http.put(undefined, 'web/category_c', data);
                this.loading = false;
                if (res.ResultCode === 0) {
                    this.getData();
                    this.eVisible = false;
                    message.success("编辑成功！");
                    return;
                }
                message.error("操作失败！" + res.ResultInfo);
            }
        } else {
            const data = {
                OrderTag: this.currItem.OrderTag,
                CategoryName: this.currItem.CategoryName,
                CategoryIcon: this.currItem.CategoryIconArray[0],
                ParentCategoryId: this.CategoryId,
            }
            if (this.checkDatas(data)) {
                const res: any = await http.post(undefined, 'web/category_c', data);
                this.loading = false;
                if (res.ResultCode === 0) {
                    this.getData();
                    this.eVisible = false;
                    message.success("新增成功！");
                    return;
                }
                message.error("操作失败！" + res.ResultInfo);
            }
        }
    }

    @action async delUserTri(it: Item) {
        const res = await http.delRaw(`web/category_c?CategoryId=${it.CategoryId}`);
        if (res.ResultCode === 0) {
            message.success("删除成功！");
            this.getData();
            return;
        }
        message.error(`删除失败：${res.ResultInfo}`);
    }

}

export const secondClassStore = new SecondClassStore();
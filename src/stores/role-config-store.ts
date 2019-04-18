import { action, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';
import { Utils } from '../utils/utils';

export class Item {
    @observable EditWhen: string = "";
    @observable EditWho: string = "";
    @observable RoleId: string = "";
    @observable RoleName: string = "";
    @observable StoreId: string = "";
}


export class RoleConfigStore {

    @observable tableData: Item[] = [];
    @observable backup: Item[] = [];
    @observable loading: boolean = false;
    @observable curRole: Item = new Item();
    @observable mEdit = false;


    // 搜索配置
    @observable searchCfg = {
        searchKey: '',
        keyChange: (key: string) => {
            this.searchCfg.searchKey = key;
            if (key === "") {
                this.searchCfg.search();
            }
        },
        search: () => {
            this.paging.current = 1;
            if (this.searchCfg.searchKey === "") {
                this.tableData = this.backup;
                return;
            }
            this.tableData = this.backup.filter(it => {
                if (
                    it.RoleId.indexOf(this.searchCfg.searchKey) !== -1 ||
                    it.RoleName.indexOf(this.searchCfg.searchKey) !== -1
                ) {
                    return true;
                }
                return false;
            });
        }
    };


    // 分页配置
    @observable paging = {
        current: 1,
        size: '10',
        onChange: (page: number) => {
            this.paging.current = page;
            this.getData();
        }
    }

    @action close = () => {
        this.mEdit = false;
    }

    @action async getData() {
        this.loading = true;
        const res = await http.getRaw("console/user/role");
        this.loading = false;
        const r = Utils.checkRes(res);
        if (!r.stat) {
            message.error("未获取到表格数据");
            return;
        }
        this.tableData = r.data.ResultList;
        this.backup = r.data.ResultList;
    }

    // 打开新增/编辑页
    @action openAddModal = (r?: Item) => () => {
        this.curRole = r ? r : (new Item());
        this.mEdit = true;
    }

    // 提交数据
    @action submit = async () => {
        const cur = this.curRole;
        const method = cur.RoleId ? http.putRaw : http.postRaw;
        const data: any = {
            RoleName: cur.RoleName
        }
        if (cur.RoleId) {
            data.RoleId = cur.RoleId;
        }
        const res = await method("console/user/role", data);
        const r = Utils.checkRes(res);
        if (r.stat) {
            message.success("操作成功");
            this.getData();
            this.mEdit = false;
            return;
        }
        message.warn("操作失败");
    }

    // 删除角色
    @action del = (id: string) => async () => {
        const res = await http.delRaw("console/user/role?RoleId=" + id);
        const r = Utils.checkRes(res);
        if (r.stat) {
            message.success("删除成功");
            this.getData();
            return;
        }
        message.warn(r.info);
    }

}

export const roleConfigStore = new RoleConfigStore();
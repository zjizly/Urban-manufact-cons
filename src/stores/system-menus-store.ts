import { action, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';
import { Utils } from '../utils/utils';

export class MenuBtn {
    @observable ButtonName: string = "";
    @observable MenuId: string = "";
    @observable RequestUrl: string = "";
    @observable ButtonId: string = "";
    @observable RequestMethod: string = "POST";
}

export class MenuC {
    @observable ParentId: number = 1;
    @observable icon: string = "";
    @observable key: string = "";
    @observable menuContent: string = "";
    @observable path: string = "";
    @observable OrderTag: string = '';
    @observable Remark: string = '';
}

export class MenuB {
    @observable ParentId: number = 1;
    @observable icon: string = "";
    @observable key: string = "";
    @observable menuContent: string = "";
    @observable path: string = "";
    @observable OrderTag: string = '';
    @observable items: MenuC[] = [];
    @observable Remark: string = '';
}

export class MenuA {
    @observable ParentId: number = 1;
    @observable icon: string = "";
    @observable key: string = "";
    @observable menuContent: string = "";
    @observable path: string = "";
    @observable OrderTag: string = '';
    @observable items: MenuB[] = [];
    @observable Remark: string = '';
}


export class SystemMenusStore {

    @observable menus: MenuA[] = [];
    @observable backup: MenuA[] = [];
    @observable loading: boolean = false;
    @observable curMenuO: MenuA = new MenuA();
    @observable curMenuA: MenuA = new MenuA();
    @observable curMenuB: MenuB = new MenuB();
    @observable curMenuC: MenuC = new MenuC();
    @observable curBtn: MenuBtn = new MenuBtn();
    @observable btnList: MenuBtn[] = [];
    @observable mEdit = false;
    @observable oEdit = false;
    @observable oEdits = false;
    @observable mBtns = false;
    @observable keyword = "";
    @observable isLeaf = false;

    // 分页配置
    @observable paging = {
        current: 1,
        total: 0,
        size: 10,
        onChange: (page: number) => {
            this.paging.current = page;
        }
    }

    @action changeKeyword = (v: string) => {
        this.keyword = v;
        if (v === "") {
            this.search();
        }
    }

    @action search = () => {
        if (this.keyword === "") {
            this.menus = this.backup;
        }

    }

    @action close = () => {
        this.mEdit = false;
        this.mBtns = false;
        this.oEdit = false;
        this.oEdits = false;
    }

    @action switchMenuA = (k: string) => {
        this.menus.forEach(m => {
            if (m.key === k) {
                this.SortBy(m.items);
                this.curMenuA = m;
            }
        })
    }
    @action SortBy = (arr: MenuB[]) => {
        arr.sort((a: MenuB, b: MenuB) => {
            return Number(a.OrderTag) - Number(b.OrderTag);
        });
    }
    @action getmenus = async () => {
        this.loading = true;
        const res = await http.getRaw("console/sysmenu");
        this.loading = false;
        const r = Utils.checkRes(res);
        // console.log(r);
        if (r.stat) {
            const ms = r.data.length ? r.data[0].items : [];
            this.SortBy(ms);
            ms.forEach((mes: any) => {
                if (mes.items.length) {
                    this.SortBy(mes.items);
                }
                mes.items.forEach((meis: any) => {
                    if (meis.items.length) {
                        this.SortBy(meis.items);
                    }
                });
            });
            this.menus = ms;
            this.backup = ms;
            if (ms.length && !this.curMenuA.key) {
                this.curMenuA = ms[0];
            }
            this.menus.forEach(m => {
                if (m.key === this.curMenuA.key) {
                    this.curMenuA = m;
                }
            });
            return;
        }
        message.warn("未获取到系统菜单");
    }


    // 编辑或者新建，如果是新建操作需要传入ParentID (pid)
    @action menuB = (pid?: string) => async () => {
        const leaf = this.isLeaf;
        const cur = leaf ? this.curMenuC : this.curMenuB;
        const method = pid ? http.postRaw : http.putRaw;
        const data: any = {
            ParentId: pid ? parseInt(pid, 10) : cur.ParentId,
            Path: cur.path,
            MenuContent: cur.menuContent,
            Icon: cur.icon,
            OrderTag: cur.OrderTag && parseInt(cur.OrderTag, 10) > 0 ? parseInt(cur.OrderTag, 10) : 0,
            IsShow: 1,
            Remark: cur.Remark || '',
        }
        if (!cur.menuContent) {
            message.warn("菜单名称不能为空");
            return;
        }
        if (!pid) {
            data.MenuId = cur.key;
        }
        if (this.isLeaf && !cur.path) {
            message.warn("路径不能为空");
            return;
        }
        const res = await method("console/sysmenu", data);
        const r = Utils.checkRes(res);
        if (r.stat) {
            message.success("操作成功");
            this.getmenus();
            this.mEdit = false;
            return;
        }
        message.warn("操作失败")
    }

    // 打开编辑框，新建二级菜单
    @action openModal = () => {
        this.isLeaf = false;
        this.curMenuB = new MenuB();
        this.mEdit = true;
    }
    @action openModals = () => {
        this.oEdits = true;
    }
    @action openModalOne = () => {
        this.curMenuO = new MenuA();
        this.oEdit = true;
    }
    @action SaveO = () => async () => {
        const data = {
            ParentId: 1,
            Path: this.curMenuO.path,
            MenuContent: this.curMenuO.menuContent,
            Icon: this.curMenuO.icon,
            OrderTag: this.curMenuO.OrderTag,
            IsShow: 1,
            Remark: this.curMenuO.Remark || '',
        }
        const res = await http.postRaw("console/sysmenu", data);
        if (!res.ResultCode) {
            this.oEdit = false;
            message.success("新建成功！");
            this.getmenus();
        } else {
            message.warn(res.ResultInfo);
        }
    }
    // 编辑二级菜单
    @action openEdit = (m: MenuB) => () => {
        this.isLeaf = false;
        this.curMenuB = m;
        this.mEdit = true;
    }

    @action openModalC = (m: MenuB) => () => {
        this.curMenuB = m;
        this.curMenuC = new MenuC();
        this.isLeaf = true;
        this.mEdit = true;
    }

    @action editC = (m: MenuC) => () => {
        this.isLeaf = true;
        this.curMenuC = m;
        this.mEdit = true;
    }

    // 删除菜单
    @action delMenu = (id: string) => async () => {
        const res = await http.delRaw("console/sysmenu", { menuid: id });
        if (res.ResultCode === 0) {
            this.getmenus();
            message.success("删除成功！");
            this.oEdits = false;
            return;
        }
        message.error("删除失败 " + res.ResultInfo);
    }

    // 创建一级菜单（临时使用）
    // @action createRoot = () => {
    //     const data = {
    //         ParentID: 1,
    //         Path: this.curMenuB.path,
    //         MenuContent: this.curMenuB.menuContent,
    //         Icon: this.curMenuB.icon
    //     }
    //     http.postRaw("store/sysmenu", data);
    // }

    @action getBtns = async (k: string) => {
        const res = await http.getRaw("consumer/menu/buttons?MenuId=" + k);
        const r = Utils.checkRes(res);
        if (r.stat) {
            this.btnList = r.data;
            return;
        }
        message.warn("未获取到按钮列表");
    }

    // 展示按钮模态框
    @action showBtnEdit = (m: MenuC) => async () => {
        this.curMenuC = m;
        this.curBtn = new MenuBtn();
        await this.getBtns(m.key);
        this.mBtns = true;
    }

    // 选择请求方法
    changeMethod = (v: string) => {
        this.curBtn.RequestMethod = v;
    }

    // 新增按钮
    @action addBtn = async () => {
        const cur = this.curBtn;
        if (!cur.ButtonName || !cur.RequestUrl) {
            message.warn("信息填写不完整");
            return;
        }
        const data = {
            ButtonName: cur.ButtonName,
            MenuId: this.curMenuC.key,
            RequestUrl: cur.RequestUrl,
            RequestMethod: cur.RequestMethod
        }
        const res = await http.postRaw("consumer/menu/buttons", data);
        const r = Utils.checkRes(res);
        if (r.stat) {
            message.success("添加成功");
            this.getBtns(this.curMenuC.key);
            return;
        }
        message.warn("操作失败");
    }

    // 删除按钮
    @action delBtn = (id: string) => async () => {
        const res = await http.delRaw("consumer/menu/buttons?ButtonId=" + id);
        const r = Utils.checkRes(res);
        if (r.stat) {
            message.success("删除成功");
            this.getBtns(this.curMenuC.key);
            return;
        }
        message.warn("删除失败");
    }




}

export const systemMenusStore = new SystemMenusStore();
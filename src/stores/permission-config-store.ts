import { action, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';
import { Utils } from '../utils/utils';
import { MenuA, MenuB, MenuC, MenuBtn } from './system-menus-store';
// import { Btn } from './user';


interface SctMenu {
    MenuID: string;
    ParentID: string;
    Path: string;
    MenuContent: string;
    Icon: string;
    IsShow: number;
    IsDelete: number;
    Buttons: string[];
    Remark: string;
    OrderTag: string;
}

export class PermissionConfigStore {
    @observable loading: boolean = false;
    @observable curMenuA: MenuA = new MenuA();
    @observable curMenuB: MenuB = new MenuB();
    @observable curMenuC: MenuC = new MenuC();
    @observable menus: MenuA[] = [];
    @observable btns: MenuBtn[] = [];
    @observable curRoleId = "";
    @observable roles: any[] = [];
    @observable sctMenus: SctMenu[] = [];
    // @observable accessMenuList: any[] = [];
    @observable accessMenuListStr: string[] = [];
    // @observable navigationMenuList: any[] = [];
    @observable navigationMenuListStr: string[] = [];
    // @observable moduleMenuList: any[] = [];
    @observable moduleMenuListStr: string[] = [];
    @observable sysmenuMenuList: string[] = [];
    @observable buttonListStr: string[] = [];
    @observable buttonListAll: string[] = [];

    @action back = () => {
        history.go(-1);
    }

    @action SortBy = (arr: MenuB[]) => {
        arr.sort((a: MenuB, b: MenuB) => {
            return Number(a.OrderTag) - Number(b.OrderTag);
        });
    }
    // 获取系统菜单
    @action getmenus = async () => {
        this.sysmenuMenuList = [];
        const res = await http.getRaw("console/sysmenu");
        const r = Utils.checkRes(res);
        if (r.stat) {
            const ms = r.data.length ? r.data[0].items : [];
            this.SortBy(ms);
            ms.forEach((mes: any) => {
                this.sysmenuMenuList.push(mes);
                if (mes.items.length) {
                    this.SortBy(mes.items);
                }
                mes.items.forEach((meis: any) => {
                    this.sysmenuMenuList.push(meis);
                    if (meis.items.length) {
                        this.SortBy(meis.items);
                    }
                    meis.items.forEach((mecs: any) => {
                        this.getBtnsAll(mecs.key);
                        this.sysmenuMenuList.push(mecs);
                    });
                });
            });
            this.menus = ms;
            if (ms.length && !this.curMenuA.key) {
                this.curMenuA = ms[0];
                if (this.curMenuA.items.length) {
                    this.curMenuB = this.curMenuA.items[0];
                    if (this.curMenuB.items.length) {
                        this.curMenuC = this.curMenuB.items[0];
                        this.getBtns(this.curMenuC.key);
                    }
                }
            }
            return;
        }
        message.warn("未获取到系统菜单");
    }
    // 获取二级菜单按钮
    @action getBtnsAll = async (p: string) => {
        const res = await http.getRaw("consumer/menu/buttons?MenuId=" + p);
        const r = Utils.checkRes(res);
        if (r.stat) {
            r.data.forEach((rs: any) => {
                this.buttonListAll.push(rs);
            });
            return;
        }
        message.warn("未获取到按钮列表");
    }
    // 获取页面按钮
    @action getBtns = async (p: string) => {
        const res = await http.getRaw("consumer/menu/buttons?MenuId=" + p);
        const r = Utils.checkRes(res);
        if (r.stat) {
            this.btns = r.data;
            return;
        }
        message.warn("未获取到按钮列表");
    }
    // 点击父菜单
    @action pedit = (it: MenuB) => () => {
        this.curMenuB = it;
        this.btns = [];
        this.curMenuC = new MenuC();
        if (this.curMenuB.items.length) {
            this.curMenuC = this.curMenuB.items[0];
            this.getBtns(this.curMenuC.key);
        }
    }

    @action clickP = (c: MenuC) => () => {
        this.curMenuC = c;
        this.getBtns(c.key);
    }
    // 切换一级菜单
    @action switchMenuA = (m: MenuA) => () => {
        this.curMenuA = m;
        this.curMenuB = new MenuB();
        this.btns = [];
        if (this.curMenuA.items.length) {
            this.curMenuB = this.curMenuA.items[0];
            if (this.curMenuB.items.length) {
                this.curMenuC = this.curMenuB.items[0];
                this.getBtns(this.curMenuC.key);
            }
        }

    }

    // 获取角色列表
    @action async getRoles() {
        const res = await http.getRaw("console/user/role");
        const r = Utils.checkRes(res);
        if (!r.stat) {
            message.error("未获取到角色列表");
            return;
        }
        if (r.data.ResultList.length) {
            this.roles = r.data.ResultList.map((ele: any) => ({
                label: ele.RoleName,
                val: ele.RoleId
            }))
        }
    }
    // 削减数组
    @action reduceArr = (arr: any[], brr: any[]) => {
        for (let i = 0; i < brr.length; i++) {
            for (let j = 0; j < arr.length; j++) {
                if (arr[j] === brr[i].key) {
                    arr.splice(j, 1);
                    j = j - 1;
                }
            }
        }
    }
    // 获取当前角色菜单
    @action getRoleMenus = async () => {
        this.accessMenuListStr = [];
        this.moduleMenuListStr = [];
        this.navigationMenuListStr = [];
        this.loading = true;
        const res = await http.getRaw("console/role/menu?RoleId=" + this.curRoleId);
        const r = Utils.checkRes(res);
        console.log(r);
        if (r.stat) {
            const ms = r.data.length && r.data[0] && r.data[0].items ? r.data[0].items : [];
            ms.forEach((m1: any) => {
                this.accessMenuListStr.push(m1.key);
                m1.items.forEach((m2: any) => {
                    this.navigationMenuListStr.push(m2.key);
                    m2.items.forEach((m3: any) => {
                        this.moduleMenuListStr.push(m3.key);
                        m3.Buttons.forEach((m4: any) => {
                            this.buttonListStr.push(m4.ButtonId);
                        });
                    });
                });
            });
            this.loading = false;
            return;
        }
        
        if (res.ResultCode !== -1) {
            message.warn("未获取到当前角色的菜单");
        }
        this.loading = false;
        this.sctMenus = [];
    }

    // 切换角色
    @action switchRole = (r: string) => {
        this.curRoleId = r;
        this.getRoleMenus();
    }









    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // 为跟新部分
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++=










    // 点击子菜单
    @action cedit = (it: MenuC) => async () => {
        this.curMenuC = it;
        if (this.hasMenu(it.key)) {
            this.sctMenus.forEach((m, i) => {
                if (m.MenuID === it.key) {
                    this.sctMenus.splice(i, 1);
                }
            })
        } else {
            this.sctMenus.push({
                MenuID: it.key,
                ParentID: "" + it.ParentId,
                Path: it.path,
                MenuContent: it.menuContent,
                Icon: it.icon,
                IsShow: 1,
                IsDelete: 0,
                Buttons: [],
                Remark: it.Remark,
                OrderTag: it.OrderTag,
            });
        }
        const pidx = this.hasA(this.curMenuB.key);
        if (pidx === -1) {
            this.sctMenus.push({
                MenuID: this.curMenuB.key,
                ParentID: "" + this.curMenuB.ParentId,
                Path: this.curMenuB.path,
                MenuContent: this.curMenuB.menuContent,
                Icon: this.curMenuB.icon,
                IsShow: 1,
                IsDelete: 0,
                Buttons: [],
                Remark: this.curMenuB.Remark,
                OrderTag: this.curMenuB.OrderTag,
            });
        } else {
            if (!this.hasChild) {
                this.sctMenus.splice(pidx, 1);
            }
        }
    }

    // 根据二级菜单key判断选中列表里是否包含一级菜单, 有则返回下标，没有则返回-1
    hasA = (k: string): number => {
        const list = this.sctMenus;
        let idx = -1;
        list.forEach((m, i) => {
            if (m.MenuID === k) {
                idx = i;
            }
        })
        return idx
    }

    // 判断当前二级菜单是否有子节点被选中
    hasChild = (): boolean => {
        const pid = this.curMenuB.key;
        const list = this.sctMenus;
        let res = false;
        list.forEach(m => {
            if (m.ParentID === pid) {
                res = true;
            }
        })
        return res;
    }

    // 判断选中列表里是否含有某个菜单
    hasMenu = (k: string): boolean => {
        let res = false;
        const list = this.sctMenus;
        list.forEach(m => {
            if (m.MenuID === k) {
                res = true;
            }
        })
        return res;
    }

    // 判断选中列表里是否含有某个按钮
    hasBtn = (k: string): boolean => {
        let res = false;
        const list = this.sctMenus;
        list.forEach(m => {
            m.Buttons.forEach(id => {
                if (id === k) {
                    res = true;
                }
            })
        })
        return res;
    }

    // 点击按钮
    @action btnClick = (id: string) => () => {
        const list = this.sctMenus;
        list.forEach(m => {
            const i = m.Buttons.indexOf(id);
            if (i === -1 && m.MenuID === this.curMenuC.key) {
                m.Buttons.push(id);
            }
            // else {
            //     // m.Buttons.splice(i, 1);

            // }
            if (i !== -1 && m.MenuID === this.curMenuC.key) {
                m.Buttons.splice(i, 1);
            }
        })
    }

    // 判断是否是全选状态
    sctall = (): boolean => {
        const k = this.curMenuC.key;
        let res = false;
        this.sctMenus.forEach(m => {
            if (m.MenuID === k) {
                if (m.Buttons.length === this.btns.length) {
                    res = true;
                }
            }
        })
        return res;
    }

    // 全选
    @action selectAll = () => {
        this.sctMenus.forEach(m => {
            if (m.MenuID === this.curMenuC.key) {
                const sctAll = m.Buttons.length === this.btns.length;
                if (!sctAll) {
                    m.Buttons = this.btns.map(b => b.ButtonId);
                } else {
                    m.Buttons = [];
                }
            }
        });
    }
    @action GetMenusData = (arr: any, brr: any) => {
        arr.forEach((ais: any) => {
            const tar: any[] = this.sysmenuMenuList.filter((si: any) => si.key === ais);
            if (tar.length) {
                tar[0].Buttons = [];
                brr.push({
                    MenuID: tar[0].key,
                    ParentID: tar[0].ParentId + "",
                    Path: tar[0].path,
                    MenuContent: tar[0].menuContent,
                    Icon: tar[0].icon,
                    IsShow: 1,
                    IsDelete: 0,
                    Buttons: [],
                    Remark: tar[0].Remark,
                    OrderTag: tar[0].OrderTag,
                });
            }
        });
    }
    @action GetMenusBtnData = (arr: any, brr: any) => {
        arr.forEach((ais: any) => {
            const tar: any[] = this.buttonListAll.filter((bs: any) => bs.ButtonId === ais);
            if (tar.length) {
                const me: any[] = brr.filter((ms: any) => ms.MenuID === tar[0].MenuId);
                if (me.length) {
                    brr.forEach((bts: any) => {
                        if (bts.MenuID === me[0].MenuID) {
                            bts.Buttons.push(ais);
                        }
                    });
                }
            }
        });
    }
    // 提交修改
    @action submit = async () => {
        const list: any = [];
        this.GetMenusData(this.accessMenuListStr, list);
        this.GetMenusData(this.navigationMenuListStr, list);
        this.GetMenusData(this.moduleMenuListStr, list);
        this.GetMenusBtnData(this.buttonListStr, list);
        list.push({
            MenuID: '1',
            ParentID: '0',
            Path: 'Root',
            MenuContent: 'Root',
            Icon: 'ion-ios-pricetags-outline',
            IsShow: 1,
            IsDelete: 0,
            Buttons: [],
            Remark: '',
            OrderTag: '1',
        });
        const newlist: any = list.map((it: any) => ({ ...it, Buttons: it.Buttons.join(":") }));
        const data = {
            RoleId: this.curRoleId,
            Menus: newlist
        }
        // console.log(JSON.stringify(data));
        const res = await http.postRaw("console/role/menu", data);
        const r = Utils.checkRes(res);
        if (r.stat) {
            message.success("配置成功");
            return
        }
        message.warn("配置失败 " + r.info);
    }


    // 初始化当前角色的选中菜单列表
    @action sctMenuInit = (rms: any) => {
        this.sctMenus = [];
        rms.forEach((m1: any) => {
            m1.items.forEach((m2: any) => {
                this.sctMenus.push({
                    MenuID: m2.key,
                    ParentID: m2.ParentId + "",
                    Path: m2.path,
                    MenuContent: m2.menuContent,
                    Icon: m2.icon,
                    IsShow: 1,
                    IsDelete: 0,
                    Buttons: m2.Buttons ? m2.Buttons : [],
                    Remark: m2.Remark,
                    OrderTag: m2.OrderTag,
                });
                m2.items.forEach((m3: any) => {
                    this.sctMenus.push({
                        MenuID: m3.key,
                        ParentID: m3.ParentId + "",
                        Path: m3.path,
                        MenuContent: m3.menuContent,
                        Icon: m3.icon,
                        IsShow: 1,
                        IsDelete: 0,
                        Buttons: m3.Buttons ? m3.Buttons : [],
                        Remark: m3.Remark,
                        OrderTag: m3.OrderTag,
                    });
                });
            });
        });
    }

}

export const permissionConfigStore = new PermissionConfigStore();
import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';
import { Md5 } from 'md5-typescript';

export class Item {
    @observable RealName: string = "";
    @observable MobileNumber: string = "";
    @observable UserState: any;
    @observable BusinessCategory: string = "";
    @observable BusinessShow: string = "";
    @observable BusinessCategorys: string[] = [];
    @observable Password: string = "";
    @observable HeadImageUrl: string = 'http://img-emake-cn.oss-cn-shanghai.aliyuncs.com/fb1c6210-08cd-11e9-b2b8-812f99b0dc90';
    @observable Email: string = "";
    @observable RoleId: string = "";
    @observable UserId: string = "";
}

export class SystemUsersStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable UserState: string = '';
    @observable RoleList: any[] = [];
    @observable RoleId: string = '';
    @observable ShowEdit: boolean = false;
    @observable BusinessList: any[] = [];
    @observable RoleListC: any[] = [];

    // 分页配置
    @observable paging = {
        current: 1,
        total: 0,
        size: 10,
        onChange: (page: number) => {
            this.paging.current = page;
            // this.getData(page);
            this.getIndustry();
        }
    }

    @computed get list() {
        return this.tableData.map((it, index) => ({ ...it, index: index + 1, key: index }))
    }
    @action search = (t: any, l: any) => {
        this.key = t;// 搜索关键字
        this.UserState = l[0].check; // 额外选项
        this.RoleId = l[1].check; // 额外选项
        this.paging.current = 1;
        this.getIndustry();
    }
    @action back = () => {
        this.ShowEdit = false;
        this.getIndustry();
    }
    @action loaded = (s: any) => {
        this.currItem.HeadImageUrl = s;
    }
    @action DelHeadImageUrl = (s: any) => {
        this.currItem.HeadImageUrl = 'http://img-emake-cn.oss-cn-shanghai.aliyuncs.com/fb1c6210-08cd-11e9-b2b8-812f99b0dc90';
    }
    @action async getRole() {
        this.RoleListC = [];
        const res = await http.getRaw(`console/user/role`);
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        res.Data.ResultList.forEach((rs: any) => {
            this.RoleListC.push({
                value: rs.RoleId,
                label: rs.RoleName
            });
        });
        this.ShowEdit = true;
    }
    @action ChnageUserState = (s: any) => async () => {
        const res = await http.putRaw(`console/userstatus`, {
            UserId: s.UserId,
            UserState: s.UserState === 0 ? '1' : '0'
        });
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        this.getIndustry();
        message.success('操作成功!');
    }
    @action Save = async (n: number) => {
        if (!n) {
            this.ShowEdit = false;
            return;
        }
        if (!this.currItem.MobileNumber || !(/^1[34578]\d{9}$/.test(this.currItem.MobileNumber))) {
            message.warn('请输入正确的手机号！');
            return;
        }
        if (!this.currItem.UserId) {
            if (!(this.currItem.Password && this.currItem.Password.length > 5 && this.currItem.Password.length < 19)) {
                message.warn('密码长度6-18位！');
                return;
            }
        }
        if (!this.currItem.RealName) {
            message.warn('请输入真实姓名！');
            return;
        }
        if (!this.currItem.Email || !(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(this.currItem.Email))) {
            message.warn('请输入正确的用户邮箱！');
            return;
        }
        if (!this.currItem.BusinessCategorys.length) {
            message.warn('请选择经营品类！');
            return;
        }
        if (!this.currItem.RoleId) {
            message.warn('请选择用户角色！');
            return;
        }
        this.currItem.Password = !this.currItem.UserId ?
            Md5.init(this.currItem.Password) : this.currItem.Password;
        this.currItem.BusinessCategory = JSON.stringify(this.currItem.BusinessCategorys);
        const meth = this.currItem.UserId ? http.putRaw : http.postRaw;
        const res = await meth(`console/user`, this.currItem);
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        message.success('保存成功!');
        this.ShowEdit = false;
        this.getIndustry();
    }
    @action async getIndustry() {
        this.BusinessList = [];
        const res = await http.getRaw(`web/category_a`);
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        res.Data.ResultList.forEach((rs: any) => {
            this.BusinessList.push({
                value: rs.CategoryId,
                label: rs.CategoryName
            });
        });
        this.getData();
    }
    @action async getData(page: number = this.paging.current) {
        this.RoleList = [{ label: '全部', value: '' }];
        this.loading = true;
        const res = await http.getRaw(
            `console/user`,
            {
                PageIndex: page,
                PageSize: 10,
                SearchContent: this.key,
                UserState: this.UserState,
                RoleId: this.RoleId,
            }
        );
        this.loading = false;
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        res.Data.List.forEach((r: any) => {
            r.BusinessShow = '';
            r.BusinessCategorys = r.BusinessCategory && r.BusinessCategory !== '' && r.BusinessCategory !== 'None'
                ? JSON.parse(r.BusinessCategory) : [];
            if (r.BusinessCategorys.length) {
                r.BusinessCategorys.forEach((bs: any) => {
                    const t = this.BusinessList.filter(bis => bis.value === bs);
                    if (t.length) {
                        r.BusinessShow += t[0].label + ' ';
                    }
                });
            }
        });
        this.tableData = res.Data.List;
        this.paging.total = res.Data.ResultCount;
        res.Data.RoleNameList.forEach((rs: any) => {
            this.RoleList.push({ label: rs.RoleName, value: rs.RoleId });
        });
    }

}

export const systemUsersStore = new SystemUsersStore();
import { action, computed, observable } from 'mobx';
import { http } from '../utils';
import { message } from 'antd';
import { Md5 } from 'md5-typescript';

export class Item {
    @observable UserState: string = "0";
    @observable EditWhen: string = "";
    @observable UserId: string = "";
    @observable MobileNumber: string = "";
    @observable Password: string = "";
    @observable RealName: string = "";
    @observable NickName: string = "";
    @observable Email: string = "";
    @observable HeadImageUrl: string = "http://img-emake-cn.oss-cn-shanghai.aliyuncs.com/fb1c6210-08cd-11e9-b2b8-812f99b0dc90";
    @observable ConsoleType: string = "2";
    @observable PasswordChange: string = "";
}

export class ServiceListStore {

    @observable tableData: Item[] = [];
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();
    @observable key: string = '';
    @observable UserState: string = '';
    @observable ShowEdit: boolean = false;
    @observable changeShow: boolean = false;

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

    @computed get list() {
        return this.tableData.map((it, index) => ({ ...it, index: index + 1, key: index }))
    }
    @action loaded = (s: any) => {
        this.currItem.HeadImageUrl = s;
    }
    @action DelHeadImageUrl = (s: any) => {
        this.currItem.HeadImageUrl = 'http://img-emake-cn.oss-cn-shanghai.aliyuncs.com/fb1c6210-08cd-11e9-b2b8-812f99b0dc90';
    }
    @action back = () => {
        this.ShowEdit = false;
        this.getData();
    }
    @action search = (t: any, l: any) => {
        this.key = t;// 搜索关键字
        this.UserState = l[0].check; // 额外选项
        this.paging.current = 1;
        this.getData();
    }
    @action handleCancelDel = () => {
        this.changeShow = false;
    }
    @action freeze = (v: any) => async () => {
        const res = await http.putRaw(`console/pcsmanage`, {
            UserId: v.UserId,
            UserState: v.UserState === '0' ? '1' : '0',
        });
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        message.success('修改成功!');
        this.getData();
    }
    @action editService = async () => {
        if (!this.currItem.MobileNumber || !(/^1[34578]\d{9}$/.test(this.currItem.MobileNumber))) {
            message.warn('请输入正确的手机号！');
            return;
        }
        if (!(this.currItem.PasswordChange && this.currItem.PasswordChange.length > 5 && this.currItem.PasswordChange.length < 19)) {
            message.warn('密码长度6-18位！');
            return;
        }
        if (this.currItem.PasswordChange) {
            this.currItem.Password =
                Md5.init(this.currItem.PasswordChange + ":emake").toLocaleLowerCase();
        }
        const res = await http.postRaw(`console/pcsmanage`, this.currItem);
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        message.success('修改成功!');
        this.changeShow = false;
        this.getData();
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
        if (!(!this.currItem.UserId && this.currItem.Password && this.currItem.Password.length > 5 && this.currItem.Password.length < 19)) {
            message.warn('密码长度6-18位！');
            return;
        }
        if (!this.currItem.RealName) {
            message.warn('请输入真实姓名！');
            return;
        }
        if (!this.currItem.Email || !(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(this.currItem.Email))) {
            message.warn('请输入正确的用户邮箱！');
            return;
        }
        if (!this.currItem.RealName) {
            message.warn('请输入真实姓名!');
            return;
        }
        if (!this.currItem.NickName) {
            message.warn('请输入客服昵称!');
            return;
        }
        this.currItem.Password = !this.currItem.UserId ?
            Md5.init(this.currItem.Password + ":emake").toLocaleLowerCase() : this.currItem.Password;
        // const meth = this.currItem.UserId ? http.putRaw :;
        const res = await http.postRaw(`console/pcsmanage`, this.currItem);
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        message.success('保存成功!');
        this.ShowEdit = false;
        this.getData();
    }
    @action async getData(page: number = this.paging.current) {
        this.loading = true;
        const res = await http.getRaw(
            `console/pcsmanage`,
            {
                pageIndex: page,
                pageSize: 10,
                SearchContent: this.key,
                UserState: this.UserState,
            }
        );
        this.loading = false;
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        this.tableData = res.Data.ResultList;
        this.paging.total = res.Data.ResultCount;
    }

}

export const serviceListStore = new ServiceListStore();
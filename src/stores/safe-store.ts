import { action, observable } from 'mobx';
import { Md5 } from 'md5-typescript';
import { http } from '../utils';
import { message } from 'antd';

export class Item {
    @observable Password: string = "";
    @observable UserId: string = "";
    @observable PasswordNew: string = "";
    @observable Passwordis: string = "";
}

export class SafeStore {
    @observable loading: boolean = false;
    @observable currItem: Item = new Item();

    @action back = () => {
        history.go(-1);
    }
    @action Save = async (n: number) => {
        if (!n) {
            this.back();
            return;
        }
        if (!this.currItem.Passwordis) {
            message.warn('请输入原密码');
            return;
        }
        if (Md5.init(this.currItem.Passwordis) !== this.currItem.Password) {
            message.warn('原密码不正确,请重新输入!');
            return;
        }
        if (!(this.currItem.PasswordNew && this.currItem.PasswordNew.length > 5 && this.currItem.PasswordNew.length < 19)) {
            message.warn('新密码长度6-18位！');
            return;
        }
        const res = await http.putRaw(`console/user/password`, { Password: Md5.init(this.currItem.PasswordNew) });
        if (res.ResultCode !== 0) {
            message.error(res.ResultInfo);
            return;
        }
        window.location.href = '/login'
    }

}

export const safeStore = new SafeStore();
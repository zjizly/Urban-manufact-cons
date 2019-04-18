import { action, observable } from 'mobx';
import { ChangeEvent } from 'react';
import { http, app } from '../utils';
import { Md5 } from 'md5-typescript';
import { message } from 'antd';
import { authStore } from './user';

export class LoginPage {
  @observable username: string = authStore.userName || '';
  @observable password: string = authStore.passwords || '';
  @observable submitting = false;

  @action usernameInput = (e: ChangeEvent<HTMLInputElement>) => {
    this.username = e.target.value || '';
  };

  @action passwordInput = (e: ChangeEvent<HTMLInputElement>) => {
    this.password = e.target.value || '';
  };

  @action login = async () => {
    this.submitting = true;
    const res = await http.postRaw('console/user/login', {
      MobileNumber: this.username,
      PassWord: Md5.init(this.password),
      client_secret: app.clientSecret,
      client_id: app.clientId,
    });
    if (res.ResultCode !== 0) {
      this.submitting = false;
      message.warn(res.ResultInfo);
      return false;
    }
    sessionStorage.setItem("access_token", res.Data.access_token);
    sessionStorage.setItem("refresh_token", res.Data.refresh_token);
    authStore.updateUserInfo({
      user: res.Data.userinfo || {},
      UserName: this.username,
      Password: this.password,
    });
    return true;
  }

  @action getUserMenu = async () => {
    const res = await http.getRaw('console/role/menu');
    if (res.ResultCode === 0) {
      const menus = res.Data.length ? res.Data[0].items : [];
      if (menus.length) {
        window.location.href = menus[0].items[0].items.length && menus[0].items.length && menus[0].items[0].items[0].path ?
          menus[0].items[0].items[0].path : '/login';
        sessionStorage.setItem("menu", JSON.stringify(menus));
        localStorage.setItem('NavigationHierarchy', '');
      } else {
        message.warn("请先给用户分配角色!");
      }
      return;
    }
    message.error(res.ResultInfo);
  }



}

export const loginPageStore = new LoginPage();
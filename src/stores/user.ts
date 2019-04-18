import { action, computed, observable } from 'mobx';

export class UserInfo {
  @observable AddWhen: string;
  @observable AddWho: string;
  @observable BusinessCategory: string;
  @observable ConsoleType: string;
  @observable NickName: string;
  @observable EditWhen: string;
  @observable EditWho: string;
  @observable Position: string;
  @observable RoleId: string;
  @observable UserState: number;
  @observable Password: string;
  @observable UserName: string;
  @observable ServiceID: string;
  @observable UserId: string;
  @observable StoreId: string;
  @observable MobileNumber: string;
  @observable consoleType: string;
  @observable RealName: string;
  @observable HeadImageUrl: string;
  @observable Email: string;
}

export interface StoreInfo {
  AddWhen: string;
  AddWho: string;
  ApplyTime: string;
  AuditTime: string;
  AuditUser: string;
  AutoReply: string;
  EditWhen: string;
  EditWho: string;
  FeaturedFirst: string;
  HeadImageUrl: string;
  MobileNumber: string;
  NickName: string;
  OnShow: string;
  OpenTime: string;
  Position: string;
  QuickReply: string;
  RealName: string;
  ReceiveInvitationCode: string;
  RecommendDate: string;
  Referrer: string;
  Remark: string;
  ServiceID: string;
  StoreBusinessCategory: string;
  StoreId: string;
  StoreInvitationCode: string;
  StoreName: string;
  StoreOrders: string;
  StorePhoto: string;
  StoreSales: string;
  StoreState: string;
  StoreSummary: string;
  StoreType: string;
  UserId: string;
  UserState: string;
}

export interface Btn {
  ButtonId: string;
  ButtonName: string;
}

export class Auth {

  @observable inProcess = true;
  @observable userInfo: UserInfo = JSON.parse(sessionStorage.getItem('user') || '0') || undefined;
  @observable storeInfo: StoreInfo = JSON.parse(sessionStorage.getItem('store') || "{}");
  BranchId: string = sessionStorage.getItem("BranchId") || "";
  BranchName: string = sessionStorage.getItem("BranchId") || "";
  Category: string = sessionStorage.getItem("Category") || "";
  // menu: MenuA[];
  menu: any[];
  btnMap: Map<string, Btn[]> = new Map<string, Btn[]>();

  constructor() {
    this.menu = JSON.parse(sessionStorage.getItem("menu") || "[]");
    this.menu.forEach((m1: any) => {
      m1.items.forEach((m2: any) => {
        m2.items.forEach((m3: any) => {
          this.btnMap.set(m3.path, m3.Buttons || []);
        })
      })
    })
  }

  @computed get authorization() {
    return sessionStorage.getItem('access_token');
  };
  @computed get user() {
    return sessionStorage.getItem('user');
  };
  @computed get userName() {
    return sessionStorage.getItem('UserName');
  };
  @computed get passwords() {
    return sessionStorage.getItem('Password');
  };
  @action updateUserInfo({ user, UserName, Password }: { user: UserInfo, UserName: any, Password: any }) {
    this.userInfo = user;
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('UserName', UserName);
    sessionStorage.setItem('Password', Password)
  }
}

export const authStore = new Auth();
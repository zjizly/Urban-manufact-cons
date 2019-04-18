import { app, CustomJSON } from '../index';
import { authStore } from '../../stores';
import { message } from 'antd';

export interface HttpConfig {
  headers?: any;
}


export interface Result<T = {}> {
  info: string;
  code: number;
  data?: T;
}

const tempConfig = {
  tempUrlDev: 'http://git.emake.cn:4000',
  tempUrlProd: 'http://win.emake.cn:4000',
  useTempUrl: false
}

let refreshed = false;
let active: any;

// 刷新token
async function refresh() {
  refreshed = true;
  active = new Promise(async resolve => {
    const rftoken = sessionStorage.getItem("refresh_token");
    const pro = fetch(`${app.baseUrl}/access_token?refresh_token=${rftoken}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const res = await pro;
    if (res.status === 403) {
      message.warn("Token已过期，请重新登陆！");
      if (window.location.href.indexOf('login') === -1) {   // 跳转到登陆页面
        window.location.href = "./login";
      }
    }
    if (res.ok) {
      const data = await res.json();
      if (data.ResultCode === 0) {
        sessionStorage.setItem("access_token", data.Data.Access_token);
        sessionStorage.setItem("refresh_token", data.Data.Refresh_token);
        refreshed = false;
        resolve();
        return;
      }
      message.warn("获取token失败");
      refreshed = false;
    }
  });
  await active
}

function _resultMap<T>(map: CustomJSON<T>): CustomJSON<Result> {
  return {
    info: 'ResultInfo',
    code: 'ResultCode',
    data: map === 'string' ? 'Data' : ['Data', map],
  };
}

function _patchUrl(url: string, params?: any, type?: string): string {
  let actualUrl = url;
  let base = app.baseUrl;
  if (tempConfig.useTempUrl) {
    base = base.indexOf("git.emake") === -1 ? tempConfig.tempUrlProd : tempConfig.tempUrlDev;
  }
  if (!/^(?:http[s]?:)?\/\//.test(url)) {
    actualUrl = `${base}/${url}`;
  }
  // if(url.indexOf('qualityinspectionreport')!==-1) {
  //   actualUrl = base.split(':')[0]+':4000'+`/${url}`
  // }

  if (typeof params !== 'undefined') {
    const box = Object.keys(params).map(key => `${key}=${params[key]}`);
    if (typeof box[0] !== 'undefined') {
      actualUrl = `${actualUrl}?${box.join('&')}`;
    }
  }
  return actualUrl;
}

function _patchHeader(headers?: any) {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': authStore.authorization,
    ...(headers || {}),
  };
}

async function _responseFilter<T>(map: CustomJSON<T> | undefined, promise: () => Promise<Response>): Promise<Result<T>> {
  try {
    let response = await promise();
    if (response.status === 401) {
      if (refreshed) {
        await active;
      } else {
        await refresh();
      }
      response = await promise();
    }
    if (response.status === 403) {
      message.warn("令牌异常，请重新登陆！");
      if (window.location.href.indexOf('login') === -1) {   // 跳转到登陆页面
        window.location.href = "./login";
      }
    }
    if (!response.ok) {
      return {
        info: '网络异常',
        code: response.status,
      }
    }
    const result = map ? app.parse(await response.text(), _resultMap(map)) : (await response.json());
    return result as Result<any>;
  } catch (e) {
    return {
      info: '网络异常',
      code: 404,
    }
  }
}

async function _get<T>(map: CustomJSON<T> | undefined, url: string, params?: any, config?: HttpConfig, type?: string): Promise<Result<T>> {
  return await _responseFilter(map, () => fetch(_patchUrl(url, params, type), {
    method: 'GET',
    mode: "cors",
    // cache: "force-cache",
    headers: _patchHeader(app.retrieveProp(config, 'headers')),
  }));
}

async function _post<T>(map: CustomJSON<T> | undefined, url: string, body?: string | object, config?: HttpConfig): Promise<Result<T>> {
  return await _responseFilter(map, () => fetch(_patchUrl(url), {
    body: typeof body === 'undefined' ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)),
    method: 'POST',
    mode: "cors",
    // cache: "force-cache",
    headers: _patchHeader(app.retrieveProp(config, 'headers')),
  }));
}

async function _put<T>(map: CustomJSON<T> | undefined, url: string, carry?: string | object, config?: HttpConfig): Promise<Result<T>> {
  return await _responseFilter(map, () => fetch(_patchUrl(url), {
    body: typeof carry === 'undefined' ? undefined : (typeof carry === 'string' ? carry : JSON.stringify(carry)),
    method: 'PUT',
    mode: "cors",
    // cache: "force-cache",
    headers: _patchHeader(app.retrieveProp(config, 'headers')),
  }));
}

async function _del<T>(map: CustomJSON<T> | undefined, url: string, params?: any, carry?: string | object, config?: HttpConfig): Promise<Result<T>> {
  return await _responseFilter(map, () => fetch(_patchUrl(url, params), {
    body: typeof carry === 'undefined' ? undefined : (typeof carry === 'string' ? carry : JSON.stringify(carry)),
    method: 'DELETE',
    mode: "cors",
    // cache: "force-cache",
    headers: _patchHeader(app.retrieveProp(config, 'headers')),
  }));
}

function switchTemp() {
  tempConfig.useTempUrl = !tempConfig.useTempUrl;
}

export default {
  ok: (code: string | number) => +code === 0,

  post: _post,

  switchTemp,

  postRaw: (url: string, body?: object, config?: HttpConfig): Promise<any> => {
    return _post(undefined, url, body, config) as any;
  },

  get: _get,

  getRaw: (url: string, params?: any, config?: HttpConfig): Promise<any> => {
    return _get(undefined, url, params, config) as any;
  },

  put: _put,

  putRaw: (url: string, carry?: object, config?: HttpConfig): Promise<any> => {
    return _put(undefined, url, carry, config) as any;
  },

  del: _del,

  delRaw: (url: string, params?: any, carry?: string | object, config?: HttpConfig): Promise<any> => {
    return _del(undefined, url, params, carry, config) as any;
  }
}
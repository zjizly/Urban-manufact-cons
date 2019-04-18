type SingleCustomJSON<T> = { [P in keyof T]: string | [string, CustomJSON<{}>] };
export type CustomJSON<T> = SingleCustomJSON<T> | [SingleCustomJSON<T>] | 'string';

class App {

  /**
   * 是否是开发环境
   */
  dev = process.env.NODE_ENV === 'development';

  /**
   * package.json 里的 version 字段
   */
  version = process.env.REACT_APP_VERSION;

  screen = {
    xs: {
      maxWidth: 575,
    },
    sm: {
      minWidth: 576,
      maxWidth: 767,
    },
    md: {
      minWidth: 768,
      maxWidth: 991,
    },
    lg: {
      minWidth: 992,
      maxWidth: 1199,
    },
    xl: {
      minWidth: 1200,
    },
  };

  hostname = {
    tests: '//192.168.0.56:3200',
    test: '//apitest.emake.cn',
    development: '//git.emake.cn:3000',
    yanshi: '//git.emake.cn:4901',
    production: '//mallapi.emake.cn',
    mqttdev: 'git.emake.cn',
    mqtttest: 'mallapi.emake.cn',
    mqttyanshi: '//git.emake.cn:4901',
    mqttpro: 'api.emake.cn',
    lookdev: '//git.emake.cn:5000',
    looktest: '//mallapitest.emake.cn:5000',
    lookpro: '//www.emake.cn:5100',
    lookyanshi: '//git.emake.cn:4901',
    client_secretdev: 'C0E90532FB42AC6DE18E25E95DB73041',
    client_iddev: 'D5F10B32131611E9AC6100163E008031',
    client_secrettest: 'C0E90532FB42AC6DE18E25E95DB73041',
    client_idtest: 'D5F10B32131611E9AC6100163E008031',
    client_secretpro: 'BD9D03102A312711B0A71ECB44581D9D',
    client_idpro: '303CF5D2239411E9ACF700163E0070DD',

  };

  // mqttUrl = this.hostname.mqttdev;
  // lookUrl = this.hostname.lookdev;
  // baseUrl = this.hostname.development;
  // clientSecret = this.hostname.client_secretdev;
  // clientId = this.hostname.client_iddev;


  // mqttUrl = this.hostname.mqttyanshi;
  // lookUrl = this.hostname.lookyanshi;
  // baseUrl = this.hostname.yanshi;
  // clientSecret = this.hostname.client_secretyanshi;
  // clientId = this.hostname.client_idyanshi;

  mqttUrl = this.hostname.mqtttest;
  lookUrl = this.hostname.looktest;
  baseUrl = this.hostname.test;
  clientSecret = this.hostname.client_secrettest;
  clientId = this.hostname.client_idtest;

  // mqttUrl = this.hostname.mqttpro;
  // lookUrl = this.hostname.lookpro;
  // baseUrl = this.hostname.production;
  // clientSecret = this.hostname.client_secretpro;
  // clientId = this.hostname.client_idpro;

  /**
   * 获取某个对象中的属性，无需做空判断
   */
  retrieveProp = (target: any, key: string) => (typeof target === 'undefined' || target === null) ? undefined : target[key];

  delay = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

  /**
   * 通过 map 对象，将对象变为 JSON 串
   */
  stringify = <T>(obj: T | T[], map: CustomJSON<T>, stringify = true): object | string | number | boolean => {
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return obj;
    }

    if (map instanceof Array && obj instanceof Array) {
      const mappedArray = obj.map(it => this.stringify(it, map[0], false));
      return stringify ? JSON.stringify(mappedArray) : mappedArray;
    }

    const result = Object.keys(map).reduce((acc, cur) => {
      const key = map[cur];
      const value = obj[cur];
      if (typeof value === 'undefined') {
        return acc;
      }
      if (typeof key === 'string') {
        return { ...acc, [key]: value };
      }
      return { ...acc, [key[0]]: this.stringify(value, key[1], false) };
    }, {});
    return stringify ? JSON.stringify(result) : result;
  };

  /**
   * 通过 map 对象，将 json 解析
   */
  parse = <T>(json: string | object | number | boolean, map: CustomJSON<T>): T | T[] => {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;

    if (typeof parsed === 'undefined') {
      return {} as any;
    }

    if (parsed instanceof Array && map instanceof Array) {
      return parsed.map(it => this.parse(it, map[0])) as T[];
    }

    return Object.keys(map).reduce((acc, cur) => {
      const key = map[cur];
      if (typeof key === 'string') {
        return { ...acc, [cur]: parsed[key] };
      }
      return { ...acc, [cur]: this.parse(parsed[key[0]], key[1]) };
    }, {}) as T;
  };

  // getAmountCn(n: number): string {
  //   const fraction = ['角', '分'];
  //   const digit = [
  //     '零', '壹', '贰', '叁', '肆',
  //     '伍', '陆', '柒', '捌', '玖'
  //   ];
  //   const unit = [
  //     ['圆', '万', '亿'],
  //     ['', '拾', '佰', '仟']
  //   ];
  //   const head = n < 0 ? '欠' : '';
  //   n = Math.abs(n);
  //   let s = '';
  //   for (let i = 0; i < fraction.length; i++) {
  //     s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
  //   }
  //   s = s || '整';
  //   n = Math.floor(n);
  //   for (let i = 0; i < unit[0].length && n > 0; i++) {
  //     let p = '';
  //     for (let j = 0; j < unit[1].length && n > 0; j++) {
  //       p = digit[n % 10] + unit[1][j] + p;
  //       n = Math.floor(n / 10);
  //     }
  //     s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  //   }
  //   return head + s.replace(/(零.)*零圆/, '圆')
  //     .replace(/(零.)+/g, '零')
  //     .replace(/^整$/, '零圆整');
  // }
  getAmountCn(money: any): any {
    // 汉字的数字
    const cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
    // 基本单位
    const cnIntRadice = new Array('', '拾', '佰', '仟');
    // 对应整数部分扩展单位
    const cnIntUnits = new Array('', '万', '亿', '兆');
    // 对应小数部分单位
    const cnDecUnits = new Array('角', '分', '毫', '厘');
    // 整数金额时后面跟的字符
    const cnInteger = '整';
    // 整型完以后的单位
    const cnIntLast = '圆';
    // 最大处理的数字
    const maxNum = 999999999999999.9999;
    // 金额整数部分
    let integerNum;
    // 金额小数部分
    let decimalNum;
    // 输出的中文金额字符串
    let chineseStr = '';
    // 分离金额后用的数组，预定义
    let parts;
    if (money === '') { return ''; }
    money = parseFloat(money);
    if (money >= maxNum) {
      // 超出最大处理数字
      return '';
    }
    if (money === 0) {
      chineseStr = cnNums[0] + cnIntLast + cnInteger;
      return chineseStr;
    }
    // 转换为字符串
    money = money.toString();
    if (money.indexOf('.') === -1) {
      integerNum = money;
      decimalNum = '';
    } else {
      parts = money.split('.');
      integerNum = parts[0];
      decimalNum = parts[1].substr(0, 4);
    }
    // 获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
      let zeroCount = 0;
      const IntLen = integerNum.length;
      for (let i = 0; i < IntLen; i++) {
        const n = integerNum.substr(i, 1);
        const p = IntLen - i - 1;
        const q = p / 4;
        const m = p % 4;
        if (n === '0') {
          zeroCount++;
        } else {
          if (zeroCount > 0) {
            chineseStr += cnNums[0];
          }
          // 归零
          zeroCount = 0;
          chineseStr += cnNums[parseInt(n, 0)] + cnIntRadice[m];
        }
        if (m === 0 && zeroCount < 4) {
          chineseStr += cnIntUnits[q];
        }
      }
      chineseStr += cnIntLast;
    }
    // 小数部分
    if (decimalNum !== '') {
      const decLen = decimalNum.length;
      for (let i = 0; i < decLen; i++) {
        const n = decimalNum.substr(i, 1);
        if (n !== '0') {
          chineseStr += cnNums[Number(n)] + cnDecUnits[i];
        }
      }
    }
    if (chineseStr === '') {
      chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum === '') {
      chineseStr += cnInteger;
    }
    return chineseStr;
  }

  getToday(): string {
    const date = new Date;
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }
  getdays(d: any): string {
    const date = new Date(d);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }
  getTodayTime(d: any): string {
    const date = new Date(d);
    const time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getMonth() + ':' + date.getHours() + ':' + date.getSeconds();
    return time;
  }

  getTime(it: any): string {
    const date = new Date(it);
    const y = date.getFullYear().toString();
    let m = (date.getMonth() + 1).toString();
    m = Number(m) < 10 ? ('0' + m) : m;
    let d = date.getDate().toString();
    d = Number(d) < 10 ? ('0' + d) : d;
    let h = date.getHours().toString();
    h = Number(h) < 10 ? ('0' + h) : h;
    let minute = date.getMinutes().toString();
    let second = date.getSeconds().toString();
    minute = Number(minute) < 10 ? ('0' + minute) : minute;
    second = Number(second) < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  }
}

export default new App();
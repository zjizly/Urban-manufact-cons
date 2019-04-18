import { action, observable, runInAction } from 'mobx';
import { toDataURL } from 'qrcode';

const productPrefix = 'https://www.emake.cn/product/';
const contractPrefix = 'https://www.emake.cn/contract/';

export class FactoryList {
  @observable CategoryBName: string = '';
  @observable Capacity: number = 0;
  @observable StoreImage: string = '';
  @observable MainCore: string = '';
  @observable FactoryAddress: string = '';
  @observable Longitude: number = 0;
  @observable FactoryId: string = '';
  @observable AmountMon: number = 0;
  @observable FactoryName: string = '';
  @observable Latitude: number = 0;
  @observable OrderQ: number = 0;
}

export class ToolStore {
  productPrefix = productPrefix;
  contractPrefix = contractPrefix;

  @observable prefix = productPrefix;
  @observable loading = true;
  @observable qrCode = '';

  @action generateQrCode = async (raw: string) => {
    if (!raw) {
      return;
    }
    this.loading = true;
    const qrImage = await toDataURL(`${this.prefix}${raw}`);
    runInAction(() => {
      this.qrCode = qrImage;
      this.loading = false;
    });
  };

  @action changePrefix = (value: string) => {
    this.prefix = value;
  }
}

export default new ToolStore();
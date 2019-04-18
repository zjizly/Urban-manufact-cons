import { action, computed, observable } from 'mobx';
import { app } from '../utils';

export class NeighbourStore {
  @observable serialNumber: number;
  @observable link: string;
  @observable status: string;
  @observable address: string;
}

export class NetStore {
  @observable loading: boolean = true;
  @observable totalCount: number = 0;
  @observable neighbourCount: number = 0;
  @observable neighbours: NeighbourStore[] = [];

  @computed get neighboursDisplay() {
    return this.neighbours.map(it => ({ key: it.serialNumber, ...it }));
  }

  @action async fetchNetData() {
    await app.delay(1000);

    this.totalCount = 9889;
    this.neighbourCount = 9;
    this.neighbours = [
      {
        serialNumber: 1,
        link: 'https://192.168.0.9',
        address: 'TkHUzjqgvpbGWecBKwTNoeoCdiQzcRpd1E',
        status: '活跃',
      },
      {
        serialNumber: 2,
        link: 'https://192.168.0.9',
        address: 'TkHUzjqgvpbGWecBKwTNoeoCdiQzcRpd1E',
        status: '活跃',
      },
      {
        serialNumber: 3,
        link: 'https://192.168.0.9',
        address: 'TkHUzjqgvpbGWecBKwTNoeoCdiQzcRpd1E',
        status: '活跃',
      },
    ];
    this.loading = false;
  }
}

export default new NetStore();
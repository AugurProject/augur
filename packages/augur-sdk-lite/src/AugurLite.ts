import { NetworkId } from '@augurproject/utils';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import LZString from 'lz-string';
import { HotLoading, HotLoadMarketInfo } from './api/HotLoading';
import { WarpSync } from './api/WarpSync';
import { MarketReportingState } from './constants';
import { MarketCreatedLog } from './logs';

interface NamedMarketCreatedLog extends MarketCreatedLog {
  name: string;
}

export interface CheckpointInterface {
  startBlockNumber: number;
  endBlockNumber: number;
  logs: NamedMarketCreatedLog[];
}

export interface Addresses {
  Universe: string;
  HotLoading: string;
  Augur: string;
  FillOrder: string;
  Orders: string;
  WarpSync: string;
}

const FILE_FETCH_TIMEOUT = 10000; // 10 seconds

export class AugurLite {
  readonly hotLoading: HotLoading;
  readonly warpSync: WarpSync;

  constructor(
    readonly provider: ethers.providers.Provider,
    readonly addresses: Addresses,
    readonly networkId: NetworkId
  ) {
    this.provider = provider;
    this.hotLoading = new HotLoading(this.provider);
    this.warpSync = new WarpSync(this.provider, addresses.WarpSync);
    this.addresses = addresses;
  }

  async hotloadMarket(marketId: string): Promise<HotLoadMarketInfo> {
    return this.hotLoading.getMarketData({
      market: marketId,
      hotLoadingAddress: this.addresses.HotLoading,
      augurAddress: this.addresses.Augur,
      fillOrderAddress: this.addresses.FillOrder,
      ordersAddress: this.addresses.Orders,
    });
  }

  async getIPFSFile(ipfsPath: string) {
    const fileRetrievalFn = (ipfsPath: string) =>
      fetch(`https://cloudflare-ipfs.com/ipfs/${ipfsPath}/index `)
        .then((item) => item.arrayBuffer())
        .then((item) => new Uint8Array(item));

    return new Promise<CheckpointInterface>(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Request timed out'));
      }, FILE_FETCH_TIMEOUT);
      const fileResult = await fileRetrievalFn(ipfsPath);
      clearTimeout(timeout);
      const decompressedResult = await LZString.decompressFromUint8Array(
        fileResult
      );
      resolve(JSON.parse(decompressedResult));
    });
  }

  async getMarketCreatedLogs() {
    const { warpSyncHash } = await this.warpSync.getLastWarpSyncData(this.addresses.Universe);
    const { logs } = await this.getIPFSFile(warpSyncHash);

    return logs.filter((log) => log.name === 'MarketCreated').map(({extraInfo, ...rest }) => ({
      id: rest.market,
      categories: [],
      ...rest,
      ...JSON.parse(extraInfo),
      extraInfo: JSON.parse(extraInfo),
      reportingState: MarketReportingState.Unknown,
      disputeInfo: {
        disputeRound: new BigNumber('0x0',
          16
        ).toFixed(),
        disputeWindow: {
          startTime: null,
          endTime: rest.endTime,
        },
        stakes: [],
      },
      disputePacingOn: false,
      stakes: []
    }));
  }
}

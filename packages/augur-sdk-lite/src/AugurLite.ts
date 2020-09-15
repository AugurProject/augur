import { logger, NetworkId, QUINTILLION, numTicksToTickSize } from '@augurproject/utils';
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import LZString from 'lz-string';
import { HotLoading, HotLoadMarketInfo } from './api/HotLoading';
import { AccountLoader, AccountData } from './api/AccountLoader';
import { WarpSync } from './api/WarpSync';
import { MarketReportingState, NullWarpSyncHash, MarketType } from './constants';
import { MarketCreatedLog } from './logs';
import { marketTypeToName } from './markets';

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
  AccountLoader: string;
  Augur: string;
  FillOrder: string;
  Orders: string;
  WarpSync: string;
}

const FILE_FETCH_TIMEOUT = 10000; // 10 seconds

export class AugurLite {
  readonly hotLoading: HotLoading;
  readonly warpSync: WarpSync;
  readonly accountLoader: AccountLoader;

  constructor(
    readonly provider: ethers.providers.Provider,
    readonly addresses: Addresses,
    readonly networkId: NetworkId
  ) {
    this.provider = provider;
    this.hotLoading = new HotLoading(this.provider);
    this.accountLoader = new AccountLoader(this.provider);
    this.warpSync = new WarpSync(this.provider, addresses.WarpSync);
    this.addresses = addresses;
  }

  async doesDBAlreadyExist() {
    const dbName = `augur-${this.networkId}`;
    const openDBRequest = indexedDB.open(dbName);
    return new Promise<boolean>((resolve, reject) => {
      // Give up if we have an error.
      openDBRequest.onerror = () => {
        reject(false);
      };

      openDBRequest.onsuccess = () => {
        const tableExists = openDBRequest.result.objectStoreNames.contains(
          'WarpSyncCheckpoints'
        );
        openDBRequest.result.close();

        // Having an empty db lying around confuses Dexie.
        if (!tableExists) indexedDB.deleteDatabase(dbName);
        resolve(tableExists);
      };
    });
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

  async loadAccountData(account: string, reputationToken: string, USDC: string, USDT: string): Promise<AccountData> {
    return this.accountLoader.getAccountData({
      accountLoaderAddress: this.addresses.AccountLoader,
      accountAddress: account,
      reputationTokenAddress: reputationToken,
      USDCAddress: USDC,
      USDTAddress: USDT,
    });
  }

  async getIPFSFile(ipfsPath: string) {
    const fileRetrievalFn = (ipfsPath: string) =>
      fetch(`https://dweb.link/ipfs/${ipfsPath}/index `)
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

  async getMarketCreatedLogs(allAvailableMarkets = false) {
    const { warpSyncHash } = await this.warpSync.getLastWarpSyncData(
      this.addresses.Universe
    );

    // The Market has not been reported on.
    if (warpSyncHash === NullWarpSyncHash)
      return [];

    try {
      const { logs } = await this.getIPFSFile(warpSyncHash);
      const { timestamp } = await this.provider.getBlock('latest');
      return logs
        .filter((log) => log.name === 'MarketCreated')
        .filter(
          !allAvailableMarkets
            ? (log) => Number(log.endTime) > timestamp
            : () => true
        )
        .filter((log) => !log.extraInfo.includes('Augur Warp Sync'))
        .map(({ extraInfo, ...rest }) => {
          let categories = [];
          let scalarDenomination = undefined;
          let description = null;
          let details = null;
          if (extraInfo) {
            try {
              const extra = JSON.parse(extraInfo);
              scalarDenomination = extra._scalarDenomination
                ? extra._scalarDenomination
                : null;
              categories = extra.categories ? extra.categories : [];
              description = extra.description ? extra.description : null;
              details = extra.longDescription ? extra.longDescription : null;
            } catch(e) {
              console.error('bad extra info', rest.market, extraInfo);
            }
          }
          const outcomesNames = rest.outcomes.map(rawOutcome => {
            return Buffer.from(rawOutcome.replace('0x', ''), 'hex')
              .toString()
              .trim()
              .replace(/\0/g, '');
          });
          let outcomes = [{id: 0, description: 'Invalid'}];
          if (rest.marketType === MarketType.YesNo) {
            outcomes = outcomes.concat([
              { id: 1, description: 'No' },
              { id: 2, description : 'Yes' }
            ]);
          } else if (rest.marketType === MarketType.Categorical) {
            outcomes = outcomes.concat(outcomesNames.map((description, index) => ({ id: index+1, description})));
          } else if (rest.marketType === MarketType.Scalar) {
            outcomes = outcomes.concat([
              { id: 1, description: scalarDenomination },
              { id: 2, description : scalarDenomination }
            ]);
          }
          let displayPrices = rest.prices;
          if (displayPrices.length == 0) {
            displayPrices = ['0', String(QUINTILLION)];
          } else {
            displayPrices = displayPrices.map(price => String(new BigNumber(price)));
          }
          const minPrice = new BigNumber(displayPrices[0]);
          const maxPrice = new BigNumber(displayPrices[1]);
          const displayMinPrice = minPrice.dividedBy(QUINTILLION);
          const displayMaxPrice = maxPrice.dividedBy(QUINTILLION);

          return {
            id: rest.market,
            outcomes,
            categories,
            description,
            details,
            minPrice: displayMinPrice,
            maxPrice: displayMaxPrice,
            marketType: marketTypeToName(rest.marketType),
            extraInfo: JSON.parse(extraInfo),
            reportingState: MarketReportingState.Unknown,
            endTime: new BigNumber(rest.endTime).toNumber(),
            disputeInfo: {
              disputeRound: new BigNumber('0x0', 16).toFixed(),
              disputeWindow: {
                startTime: null,
                endTime: rest.endTime,
              },
              stakes: [],
            },
            disputePacingOn: false,
            stakes: [],
          }
      });
    } catch (e) {
      logger.error(e);
      return [];
    }
  }
}

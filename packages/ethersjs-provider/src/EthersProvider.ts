import { AsyncQueue, queue, retry } from 'async';
import { BigNumber } from 'bignumber.js';
import { Abi } from 'ethereum';
import { JSONRPCErrorCallback, JSONRPCRequestPayload } from 'ethereum-types';
import { ethers } from 'ethers';
import * as _ from 'lodash';

import {
  EthersProvider as EProvider,
  Transaction,
} from '@augurproject/contract-dependencies-ethers';
import { Log, LogValues } from '@augurproject/types';
import { logger, LoggerLevels, NetworkId, getGasStation } from '@augurproject/utils';

import { FasterAbiInterface } from './FasterAbiInterface';
import { Counter, isInstanceOfArray, isInstanceOfBigNumber } from './utils';


declare global {
  interface Array<T> {
    toLowerCase(): T[];
  }
}

Array.prototype.toLowerCase = function () {
  return this.map((item) => item.toLowerCase());
};

interface MultiAddressFilter {
  blockhash?: string;
  fromBlock?: number | string;
  toBlock?: number | string;
  address?: string | string[];
  topics?: Array<string | string[]>;
}

interface ContractMapping {
  [contractName: string]: FasterAbiInterface;
}

interface PerformQueueTask {
  message: any;
  params: any;
}

export class EthersProvider extends ethers.providers.BaseProvider
  implements EProvider {
  gasLimit: ethers.utils.BigNumber | null = new ethers.utils.BigNumber(
    10000000
  );
  gasEstimateIncreasePercentage: BigNumber | null = new BigNumber(10);
  private contractMapping: ContractMapping = {};
  private performQueue: AsyncQueue<PerformQueueTask>;
  provider: ethers.providers.JsonRpcProvider;

  private _overrideGasPrice: ethers.utils.BigNumber | null = null;
  get overrideGasPrice() {
    return this._overrideGasPrice;
  }
  set overrideGasPrice(gasPrice: ethers.utils.BigNumber | null) {
    if (gasPrice !== null && gasPrice.eq(new ethers.utils.BigNumber(0))) {
      this._overrideGasPrice = null;
    } else {
      this._overrideGasPrice = gasPrice;
    }
  }

  private _mostRecentLatestBlockHeaders: Promise<any> | null;
  private _callCache = new Map<any, Promise<any>>();
  private callCount = new Counter();
  private cacheCount = new Counter();

  printOutAndClearCallCount = () => {
    logger.table(LoggerLevels.info, this.callCount.toTabularData());
    this.callCount.clear();
    logger.table(LoggerLevels.info, this.cacheCount.toTabularData());
    this.cacheCount.clear();
  };

  constructor(
    provider: ethers.providers.JsonRpcProvider,
    times: number,
    interval: number,
    concurrency: number
  ) {
    super(provider.getNetwork());
    setInterval(this.printOutAndClearCallCount, 60000);
    this.on('block', this.onNewBlock.bind(this));
    this.provider = provider;
    this.performQueue = queue(
      (
        item: PerformQueueTask,
        callback: (err: Error, results: any) => void
      ) => {
        const _this = this;
        retry(
          {
            times,
            interval (retryCount) {
              return interval * Math.pow(2, retryCount);
            },
            errorFilter (err) {
              return (
                err.message.includes('Rate limit') ||
                err['code'] === -32000 ||
                err.message.includes('429')
              );
            },
          },
          async () => {
            let result: Promise<any>;
            const itemString = JSON.stringify(item);
            if (
              (item.message === 'call' ||
                item.message === 'getBalance' ||
                (item.message === 'getBlock' &&
                  item.params.blockTag !== 'latest')) &&
              process.env.NODE_ENV !== 'test' &&
              this._callCache.has(itemString)
            ) {
              this.cacheCount.increment(item.message);
              return this._callCache.get(itemString);
            }
            if (item.message === 'send') {
              if (typeof item.params.params === 'undefined') {
                item.params.params = [];
              }
              const {
                method,
                params: [blocktag, includeHeaders],
              } = item.params;
              this.callCount.increment(method);
              if (
                method === 'eth_getBlockByNumber' &&
                blocktag === 'latest' &&
                !!includeHeaders === false &&
                _this.polling &&
                process.env.NODE_ENV !== 'test'
              ) {
                if (!_this._mostRecentLatestBlockHeaders) {
                  _this._mostRecentLatestBlockHeaders = _this.providerSend(
                    item.params.method,
                    item.params.params
                  );
                } else {
                  this.callCount.decrement(method);
                  this.cacheCount.increment('eth_getBlockByNumber');
                }
                return _this._mostRecentLatestBlockHeaders;
              }
              result = _this.providerSend(
                item.params.method,
                item.params.params
              );
            } else {
              const { blockTag, includeTransactions } = item.params;
              this.callCount.increment(item.message);
              if (
                (item.message === 'getBlockNumber' ||
                  item.message === 'getBlock') &&
                blockTag === 'latest' &&
                !!includeTransactions === false &&
                _this.polling &&
                process.env.NODE_ENV !== 'test'
              ) {
                if (!_this._mostRecentLatestBlockHeaders) {
                  _this._mostRecentLatestBlockHeaders = _this.providerPerform(
                    item.message,
                    item.params
                  );
                } else {
                  this.callCount.decrement(item.message);
                  this.cacheCount.increment(item.message);
                }
                return _this._mostRecentLatestBlockHeaders;
              }
              result = _this.providerPerform(item.message, item.params);
            }
            if (
              (item.message === 'call' ||
                item.message === 'getBalance' ||
                (item.message === 'getBlock' &&
                  item.params.blockTag !== 'latest')) &&
              process.env.NODE_ENV !== 'test'
            ) {
              this._callCache.set(itemString, result);
            }
            return result;
          },
          callback
        );
      },
      concurrency
    );
  }

  onNewBlock(blockNumber: number): void {
    this._mostRecentLatestBlockHeaders = null;
    this._callCache = new Map<any, Promise<any>>();
  }

  setProvider(provider: ethers.providers.JsonRpcProvider): void {
    this.provider = provider;
  }

  async providerSend(method: string, params: any): Promise<any> {
    return this.provider.send(method, params);
  }

  async providerPerform(message: string, params: any): Promise<any> {
    return this.provider.perform(message, params);
  }

  async listAccounts(): Promise<string[]> {
    return this.provider.listAccounts();
  }

  async call(
    transaction: Transaction<ethers.utils.BigNumber>
  ): Promise<string> {
    const txRequest: ethers.providers.TransactionRequest = transaction;
    return super.call(txRequest);
  }

  async getNetworkId(): Promise<NetworkId> {
    return (await this.getNetwork()).chainId.toString() as NetworkId;
  }

  async getBlockNumber(): Promise<number> {
    return super.getBlockNumber();
  }

  async getGasPrice(networkId?: NetworkId): Promise<ethers.utils.BigNumber> {
    if (this.overrideGasPrice !== null) {
      return this.overrideGasPrice;
    }

    const viaProviderPromise = super.getGasPrice();

    networkId = networkId || await this.getNetworkId();
    const viaGasStation = await getGasStation(networkId)
      .then((gasStation) => {
        return new ethers.utils.BigNumber(gasStation.standard);
      }).catch((err) => {
        console.warn('gas station query failed:', err);
        return null;
      });

    const viaProvider = await viaProviderPromise; // delays await for simultaneity

    // prefer higher estimate
    if (viaGasStation === null || viaProvider.gt(viaGasStation)) {
      return viaProvider;
    } else {
      return viaGasStation;
    }
  }

  async estimateGas(
    transaction: ethers.providers.TransactionRequest
  ): Promise<ethers.utils.BigNumber> {
    transaction.gasPrice = await this.getGasPrice();
    let gasEstimate = new BigNumber(
      (await super.estimateGas(transaction)).toString()
    );
    if (this.gasEstimateIncreasePercentage) {
      gasEstimate = this.gasEstimateIncreasePercentage
        .div(100)
        .plus(1)
        .times(gasEstimate)
        .idiv(1);
    }

    if (this.gasLimit) {
      gasEstimate = gasEstimate.gt(this.gasLimit.toString())
        ? new BigNumber(this.gasLimit.toString())
        : gasEstimate;
    }

    return new ethers.utils.BigNumber(gasEstimate.toFixed());
  }

  storeAbiData(abi: Abi, contractName: string): void {
    this.contractMapping[contractName] = new FasterAbiInterface(abi);
  }

  async getEthBalance(address: string): Promise<string> {
    const result = await super.getBalance(address);
    return result.toString();
  }

  getEventTopic(contractName: string, eventName: string): string {
    const contractInterface = this.getContractInterface(contractName);
    if (contractInterface.events[eventName] === undefined) {
      throw new Error(
        `Contract name ${contractName} did not have event ${eventName}`
      );
    }
    return contractInterface.events[eventName].topic;
  }

  encodeContractFunction(
    contractName: string,
    functionName: string,
    funcParams: any[]
  ): string {
    const contractInterface = this.getContractInterface(contractName);
    const func = contractInterface.functions[functionName];
    if (func === undefined) {
      throw new Error(
        `Contract name ${contractName} did not have function ${functionName}`
      );
    }
    const ethersParams = _.map(funcParams, (param) => {
      if (isInstanceOfBigNumber(param)) {
        return new ethers.utils.BigNumber(param.toFixed());
      } else if (
        isInstanceOfArray(param) &&
        param.length > 0 &&
        isInstanceOfBigNumber(param[0])
      ) {
        return _.map(
          param,
          (value) => new ethers.utils.BigNumber(value.toFixed())
        );
      }
      return param;
    });
    return func.encode(ethersParams);
  }

  parseLogValues(contractName: string, log: Log): LogValues {
    const contractInterface = this.getContractInterface(contractName);
    const parsedLog = contractInterface.fastParseLog(log);
    const omittedValues = _.map(_.range(parsedLog.values.length), (n) =>
      n.toString()
    );
    omittedValues.push('length');
    const logValues = _.omit(parsedLog.values, omittedValues);
    return {
      name: parsedLog.name,
      ..._.mapValues(logValues, (val: any) => {
        if (val._hex) {
          return val._hex;
        } else if (Array.isArray(val)) {
          val = _.map(val, (innerVal) => {
            if (innerVal._hex) {
              return innerVal._hex;
            }
            return innerVal;
          });
        }
        return val;
      }),
    };
  }

  private getContractInterface(contractName: string): FasterAbiInterface {
    const contractInterface = this.contractMapping[contractName];
    if (!contractInterface) {
      throw new Error(
        `Contract name ${contractName} not found in EthersJSProvider. Call 'storeAbiData' first with this name and the contract abi`
      );
    }
    return contractInterface;
  }

  // We're primarily hacking this and bypassing ethers to support multiple addresses in the filter but this also allows us to cut out some expensive behavior we don't care about for the address
  async getMultiAddressLogs(filter: MultiAddressFilter): Promise<Log[]> {
    await this.ready;
    if (filter.fromBlock !== undefined) {
      filter.fromBlock = ethers.utils.hexStripZeros(
        ethers.utils.hexlify(filter.fromBlock)
      );
    }
    if (filter.toBlock !== undefined) {
      filter.toBlock = ethers.utils.hexStripZeros(
        ethers.utils.hexlify(filter.toBlock)
      );
    }
    const logs = await this.perform('getLogs', { filter });
    for (const log of logs) {
      log.logIndex = parseInt(log.logIndex, 16);
      log.blockNumber = parseInt(log.blockNumber, 16);
      log.transactionIndex = parseInt(log.transactionIndex, 16);
      log.blockHash = formatLogHash(log.blockHash);
      log.transactionHash = formatLogHash(log.transactionHash);
      log.topics = _.map(log.topics, formatLogHash);
      log.data = log.data ? ethers.utils.hexlify(log.data) : '0x';
    }
    return logs;
  }

  private async _getLogs(
    filter: MultiAddressFilter
  ): Promise<ethers.providers.Log[]> {
    try {
      return await this.getMultiAddressLogs(filter);
    } catch (e) {
      // Check if infura log limit error.
      // See https://infura.io/docs/ethereum/json-rpc/eth_getLogs.
      if (e.code === -32005) return this.getSplitLogs(filter, 2);

      // -32600 is an invalid request... hence the message check.
      if (
        e.code === -32600 &&
        (e.message?.includes('Requested block range for eth_getLogs is greater than the limit of 1000 blocks.') ||
         e.reponseText?.includes('Requested block range for eth_getLogs is greater than the limit of 1000 blocks.'))
      ) {
        return this.getLogsWithLimitedBlockRange(filter);
      }

      throw e;
    }
  }

  getLogsWithLimitedBlockRange = async (
    filter: MultiAddressFilter,
    blockRangeLimit = 1000
  ): Promise<ethers.providers.Log[]> => {
    const fromBlock = Number(filter.fromBlock);
    const toBlock = Number(filter.toBlock || await this.getBlockNumber());

    let currentBlock = fromBlock;
    let logs = [];
    while(currentBlock < toBlock) {
      const nextEndBlock = Math.min(currentBlock + blockRangeLimit, toBlock);
      logs = [
        ...logs,
        ...await this.getMultiAddressLogs({
          ...filter,
          fromBlock: currentBlock,
          toBlock: nextEndBlock
        })
      ];

      currentBlock = nextEndBlock + 1;
    }

    return logs;
  };

  getSplitLogs = async (
    filter: MultiAddressFilter,
    desiredDepth: number
  ): Promise<ethers.providers.Log[]> => {
    // bisect the block window.
    const midBlock = Math.floor(
      (Number(filter.toBlock) + Number(filter.fromBlock)) / 2
    );

    // Presumably we would never have more than 10k logs in one block but just in case.
    if (Number(filter.fromBlock) === midBlock) throw new Error('Log Limit encountered in a single block');

    const firstFilter = {
      ...filter,
      toBlock: midBlock,
    };

    const secondFilter = {
      ...filter,
      fromBlock: midBlock + 1,
    };

    if (desiredDepth == 0) {
      return [
        ...(await this._getLogs(firstFilter)),
        ...(await this._getLogs(secondFilter)),
      ];
    }

    desiredDepth -= 1;

    return [
      ...(await this.getSplitLogs(firstFilter, desiredDepth)),
      ...(await this.getSplitLogs(secondFilter, desiredDepth)),
    ];
  };

  getLogs = async (filter: MultiAddressFilter): Promise<Log[]> => {
    const logs = await this._getLogs(filter);
    return logs.map<Log>((log) => ({
      name: '',
      transactionHash: '',
      blockNumber: 0,
      blockHash: '',
      logIndex: 0,
      transactionIndex: 0,
      removed: false,
      ...log,
    }));
  };

  // This is to support the Web3 Spec
  sendAsync(
    payload: JSONRPCRequestPayload,
    callback?: JSONRPCErrorCallback
  ): void {
    this.performQueue.push(
      { message: 'send', params: payload },
      (error, result) => {
        if (callback) {
          callback(error, {
            result,
            id: payload.id,
            jsonrpc: payload.jsonrpc,
          });
        }
      }
    );
  }

  async perform(message: any, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.performQueue.push({ message, params }, (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  }

  disconnect(): void {}
}

function formatLogHash(hash: string): string {
  if (hash.substring(0, 2) !== '0x') hash = '0x' + hash;
  return hash.toLowerCase();
}

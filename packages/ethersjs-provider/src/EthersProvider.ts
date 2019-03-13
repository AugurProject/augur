import { NetworkId } from "@augurproject/artifacts";
import { Filter, Log, LogValues } from "@augurproject/api";
import { Transaction } from "contract-dependencies";
import { EthersProvider as EProvider } from "contract-dependencies-ethers";
import { ethers } from "ethers";
import { Abi } from "ethereum";
import * as _ from "lodash";
import { retry } from "async";

interface ContractMapping {
  [contractName: string]: ethers.utils.Interface;
}

export class EthersProvider extends ethers.providers.BaseProvider implements EProvider {
  private contractMapping: ContractMapping = {};
  private opts: number | {
    times: number,
    interval: number | ((retryCount: number) => number)
  };

  constructor(readonly provider: ethers.providers.JsonRpcProvider, times: number, interval: number, readonly concurrency: number) {
    super(provider.getNetwork());
    this.opts = { times, interval };
  }

  public async listAccounts(): Promise<Array<string>> {
    return this.provider.listAccounts();
  }

  public async call(transaction: Transaction<ethers.utils.BigNumber>): Promise<string> {
    return await super.call(transaction);
  }

  public async getNetworkId(): Promise<NetworkId> {
    return <NetworkId>(await this.getNetwork()).chainId.toString();
  }

  public async getBlockNumber(): Promise<number> {
    return await super.getBlockNumber();
  }

  public storeAbiData(abi: Abi, contractName: string): void {
    this.contractMapping[contractName] = new ethers.utils.Interface(abi);
  }

  public getEventTopic(contractName: string, eventName: string): string {
    const contractInterface = this.contractMapping[contractName];
    if (!contractInterface) {
      throw new Error(`Contract name ${contractName} not found in EthersJSProvider. Call 'storeAbiData' first with this name and the contract abi`);
    }
    return contractInterface.events[eventName].topic;
  }

  public parseLogValues(contractName: string, log: Log): LogValues {
    const contractInterface = this.contractMapping[contractName];
    if (!contractInterface) {
      throw new Error(`Contract name ${contractName} not found in EthersJSProvider. Call 'storeAbiData' first with this name and the contract abi`);
    }
    const parsedLog = contractInterface.parseLog(log);
    let omittedValues = _.map(_.range(parsedLog.values.length), (n) => n.toString());
    omittedValues.push('length');
    let logValues = _.omit(parsedLog.values, omittedValues);
    logValues = _.mapValues(logValues, (val) => {
      if (val._hex) {
        return val._hex;
      }
      return val;
    });
    return logValues;
  }

  public async getLogs(filter: Filter): Promise<Array<Log>> {
    return super.getLogs(filter);
  }

  public async perform(message: any, params: any): Promise<any> {
    const _this = this;
    return new Promise((resolve, reject) => {
      retry(
        this.opts,
        async function (callback) {
          let results: any;
          try {
            results = await _this.provider.perform(message, params);
          } catch (err) {
            callback(err, undefined);
          }
          callback(null, results);
        },
        function (err: Error, results: any) {
          if (err) {
            reject(err);
          }
          resolve(results);
        }
      );
    });
  }
}

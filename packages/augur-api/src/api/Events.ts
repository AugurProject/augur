import { Provider } from '../ethereum/Provider';
import { ParsedLog } from '../ethereum/types';
import * as _ from "lodash";
import * as abiJson from '../../../augur-artifacts/abi.json';
import { Abi } from "ethereum";

export class Events {
  private readonly provider: Provider;
  private readonly augurAddress: string;

  public constructor (provider: Provider, augurAddress: string) {
    this.provider = provider;
    this.augurAddress = augurAddress;
    this.provider.storeAbiData(<Abi>abiJson["Augur"], "Augur");
  }

  public async getLogs(eventName: string, fromBlock: number, toBlock: number, additionalTopics?: Array<string | Array<string>>): Promise<Array<ParsedLog>> {
    let topics: Array<string | Array<string>> = [this.provider.getEventTopic("Augur", eventName)];
    if (additionalTopics) {
      topics = topics.concat(additionalTopics);
    }
    const logs = await this.provider.getLogs({fromBlock, toBlock, topics, address: this.augurAddress});
    const parsedLogs = _.map(logs, (log) => {
      const logValues = this.provider.parseLogValues("Augur", log);
      return Object.assign(
        logValues,
        {
          blockNumber: log.blockNumber,
          blockHash: log.blockHash,
          transactionIndex: log.transactionIndex,
          removed: log.removed,
          transactionLogIndex: log.transactionLogIndex,
          transactionHash: log.transactionHash,
          logIndex: log.logIndex,
        }
      )
    });
    return parsedLogs;
  }
}

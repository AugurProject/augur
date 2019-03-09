import {Provider} from "../ethereum/Provider";
import {Log, ParsedLog} from "../ethereum/types";
import * as _ from "lodash";
import {abi} from "@augurproject/artifacts";
import {Abi} from "ethereum";

export class Events {
  private readonly provider: Provider;
  private readonly augurAddress: string;

  public constructor(provider: Provider, augurAddress: string) {
    this.provider = provider;
    this.augurAddress = augurAddress;
    this.provider.storeAbiData(<Abi>abi["Augur"], "Augur");
  }

  public async getLogs(
    eventNames: Array<string>,
    fromBlock: number,
    toBlock: number,
    additionalTopics?: Array<string | Array<string>>
  ): Promise<Array<Log>> {
    let events: Array<string> = [];
    for (let eventName of eventNames) {
      events.push(this.provider.getEventTopic("Augur", eventName));
    }
    let topics: Array<string | Array<string>> = [events];
    if (additionalTopics) {
      topics = topics.concat(additionalTopics);
    }

    return this.provider.getLogs({fromBlock, toBlock, topics, address: this.augurAddress});
  }

  public parseLogs(logs: Array<Log>): Array<ParsedLog> {
    return _.map(logs, (log) => {
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
  }
}

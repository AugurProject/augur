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

  public async getLogs(eventNames: Array<string>, fromBlock: number, toBlock: number, additionalTopics?: Array<string | Array<string>>): Promise<Array<ParsedLog>> {
    let events: Array<string> = [];
    for (let eventName of eventNames) {
      events.push(this.provider.getEventTopic("Augur", eventName));
    }
    let topics: Array<string | Array<string>> = [events];
    if (additionalTopics) {
      topics = topics.concat(additionalTopics);
    }
    // console.log("params");
    // console.log({fromBlock, toBlock, topics, address: this.augurAddress});

    // let blah: any = [ [ '0x32d554e498d0c7f2a5c7fd8b6b234bfc4e1dfb5290466d998af09a813db32f31' ] ];
    // blah.fill("", 3);
    // blah[1] = "0x000000000000000000000000913da4198e6be1d5f5e4a40d0667f70c0b5430eb";
    // topics = blah;

    const logs = await this.provider.getLogs({fromBlock, toBlock, topics, address: this.augurAddress});
    return this.parseLogs(logs);
  }

  public parseLogs(logs: Log[]): ParsedLog[] {
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

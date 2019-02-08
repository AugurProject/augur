import { ParsedLog, Provider } from "../";
import * as abiJson from "augur-artifacts/abi.json";
import { Abi } from "ethereum";
import { Address } from "augur-core";

export class Events {
  private readonly provider: Provider;
  private readonly augurAddress: Address;

  public constructor(provider: Provider, augurAddress: Address) {
    this.provider = provider;
    this.augurAddress = augurAddress;
    this.provider.storeAbiData(<Abi>abiJson["Augur"], "Augur");
  }

  public async getLogs(eventName: string, fromBlock: number, toBlock: number, additionalTopics?: Array<string | Array<string>>): Promise<Array<ParsedLog>> {
    let topics: Array<string | Array<string>> = [this.provider.getEventTopic("Augur", eventName)];
    if (additionalTopics) {
      topics = topics.concat(additionalTopics);
    }
    const logs = await this.provider.getLogs({ fromBlock, toBlock, topics, address: this.augurAddress.to0xString() });
    return logs.map((log) => {
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

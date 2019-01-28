import { Provider } from '../ethereum/Provider';
import { MarketCreatedLog, OrderCreatedLog } from '../ethereum/types';
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

  public async getMarketCreatedLogs(fromBlock: number, toBlock: number): Promise<Array<MarketCreatedLog>> {
    const topics: Array<string> = [this.provider.getEventTopic("Augur", "MarketCreated")];
    const logs = await this.provider.getLogs({fromBlock, toBlock, topics, address: this.augurAddress});
    const marketCreatedLogs = _.map(logs, (log) => {
      const logValues = this.provider.parseLogValues("Augur", log);
      return Object.assign(
        {
          topic: logValues["topic"],
          description: logValues["description"],
          extraInfo: logValues["extraInfo"],
          universe: logValues["universe"],
          market: logValues["market"],
          marketCreator: logValues["marketCreator"],
          outcomes: logValues["outcomes"],
          marketCreationFee: logValues["marketCreationFee"],
          minPrice: logValues["minPrice"],
          maxPrice: logValues["maxPrice"],
          marketType: logValues["marketType"],
        },
        logValues,
        log
      )
    });
    return marketCreatedLogs;
  }

  public async getOrderCreatedLogs(fromBlock: number, toBlock: number): Promise<Array<OrderCreatedLog>> {
    const topics: Array<string> = [this.provider.getEventTopic("Augur", "OrderCreated")];
    const logs = await this.provider.getLogs({fromBlock, toBlock, topics, address: this.augurAddress});
    const orderCreatedLogs = _.map(logs, (log) => {
      const logValues = this.provider.parseLogValues("Augur", log);
      return Object.assign(
        {
          orderType: logValues["orderType"],
          amount: logValues["amount"],
          price: logValues["price"],
          creator: logValues["creator"],
          moneyEscrowed: logValues["moneyEscrowed"],
          sharesEscrowed: logValues["sharesEscrowed"],
          tradeGroupId: logValues["tradeGroupId"],
          orderId: logValues["orderId"],
          universe: logValues["universe"],
          shareToken: logValues["shareToken"]
        },
        logValues,
        log
      )
    });
    return orderCreatedLogs;
  }
}

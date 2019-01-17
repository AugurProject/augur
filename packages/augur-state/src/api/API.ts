import { EthersAugurInterfaces, NetworkConfiguration } from "augur-core";

export class API {
  private readonly data: number;
  private readonly test: EthersAugurInterfaces.Trade;

  public constructor (data: number, test: EthersAugurInterfaces.Trade, conf: NetworkConfiguration) {
    // TODO connection to DB
    // 
  }

  public static async factory(data: number, test: EthersAugurInterfaces.Trade, conf: NetworkConfiguration): Promise<API> {
    const apiController = new API(data, test, conf);
    return apiController;
  }
}

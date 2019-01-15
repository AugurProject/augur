import { ethers } from "ethers";
import { EthersAugurInterfaces, NetworkConfiguration } from "@augurproject/core";

export class APIController {
  private readonly data: number;
  private readonly test: EthersAugurInterfaces.Trade;

  public constructor (data: number, test: EthersAugurInterfaces.Trade, conf: NetworkConfiguration) {
    this.data = data;
    this.test = test;
    console.log(conf.http);
  }

  public static async factory(data: number, test: EthersAugurInterfaces.Trade, conf: NetworkConfiguration): Promise<APIController> {
    const apiController = new APIController(data, test, conf);
    return apiController;
  }

  public async doThing(data: number): Promise<number> {
    return await this.doThingInternal(data);
  }

  private async doThingInternal(data: number): Promise<number> {
    return data;
  }
}

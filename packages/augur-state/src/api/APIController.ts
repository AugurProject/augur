import { ethers } from "ethers";
import { EthersAugurInterfaces } from "augur-core";

export class APIController {
  private readonly data: number;
  private readonly test: EthersAugurInterfaces;

  public constructor (data: number, test: EthersAugurInterfaces) {
    this.data = data;
    this.test = test;
  }

  public static async factory(data: number, test: EthersAugurInterfaces): Promise<APIController> {
    const apiController = new APIController(data, test);
    return apiController;
  }

  public async doThing(data: number): Promise<number> {
    return await this.doThingInternal(data);
  }

  private async doThingInternal(data: number): Promise<number> {
    return data;
  }
}

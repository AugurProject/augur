import { ethers } from "ethers";

export class SyncController {
  private readonly data: number;

  public constructor (data: number) {
    this.data = data;
  }

  public static async factory(data: number): Promise<SyncController> {
    const syncController = new SyncController(data);
    return syncController;
  }

  public async doThing(data: number): Promise<number> {
    return await this.doThingInternal(data);
  }

  private async doThingInternal(data: number): Promise<number> {
    return data;
  }
}

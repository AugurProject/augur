import { ethers } from "ethers";

export class Controller {
  private readonly data: number;

  public constructor (data: number) {
    this.data = data;
  }

  public static async factory(data: number): Promise<Controller> {
    const controller = new Controller(data);
    return controller;
  }

  public async doThing(data: number): Promise<number> {
    return await this.doThingInternal(data);
  }

  private async doThingInternal(data: number): Promise<number> {
    return data;
  }
}

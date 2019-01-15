import { ethers } from "ethers";

export class ServerController {
  private readonly data: number;

  public constructor (data: number) {
    this.data = data;
  }

  public static async factory(data: number): Promise<ServerController> {
    const serverController = new ServerController(data);
    return serverController;
  }

  public async doThing(data: number): Promise<number> {
    return await this.doThingInternal(data);
  }

  private async doThingInternal(data: number): Promise<number> {
    return data;
  }
}

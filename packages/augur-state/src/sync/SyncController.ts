import { ethers } from "ethers";

export class SyncController {
  private readonly data: number;

  public constructor (data: number) {
    this.data = data;
  }

  public async beginSync(data: number): Promise<number> {
    // TODO connect to / initialize DB
    // TODO connect to ethereum node
    // TODO get desired block range
    // TODO pull and process logs in chunks
    // TODO start blockstream to pull and process logs as they come in
    return 1;
  }
}

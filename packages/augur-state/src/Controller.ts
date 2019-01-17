import { sleep } from "./utils/utils";

export class Controller {
  private readonly data: number;

  public constructor (data: number) {
    this.data = data;
  }

  public async run(data: number): Promise<number> {
    // TODO begin sync process
    // TODO begin server process
    while (1) {
      await sleep(1000);
    }
    return 1;
  }
}

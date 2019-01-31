
export class ServerController {
  private readonly data: number;

  public constructor (data: number) {
    // TODO initialize with a provided API object or create a new one if given configuration
    this.data = data;
  }

  public async start(data: number): Promise<number> {
    // TODO start up server process
    return 1;
  }
}

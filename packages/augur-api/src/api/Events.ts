import { Provider } from '../ethereum/Provider';
import { Log } from '../ethereum/types';

export class Events {
  private readonly provider: Provider;
  private readonly augurAddress: string;

  public constructor (provider: Provider, augurAddress: string) {
    this.provider = provider;
    this.augurAddress = augurAddress;
  }

  public async getAugurLogs(fromBlock: number, toBlock: number): Promise<Log[]> {
    return await this.provider.getLogs({fromBlock, toBlock, address: this.augurAddress});
  }

  public async getMarketCreatedLogs(fromBlock: number, toBlock: number): Promise<Log[]> {
    const topics: Array<string> = [XXX];
    return await this.provider.getLogs({fromBlock, toBlock, topics, address: this.augurAddress});
  }
}

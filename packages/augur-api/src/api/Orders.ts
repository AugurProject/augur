import { Provider } from '../ethereum/Provider';
import { Contracts } from './Contracts';

export class Orders<TBigNumber> {
  private readonly provider: Provider;
  private readonly contracts: Contracts<TBigNumber>;

  public constructor (provider: Provider, contracts: Contracts<TBigNumber>) {
    this.provider = provider;
    this.contracts = contracts;
  }

  public async getOrders(arg: any): Promise<void> {
    // TODO
  }
}

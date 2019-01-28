import { Provider } from '../ethereum/Provider';
import { Contracts } from './Contracts';

export interface TradeParams {
  // TODO
}

export class Trade<TBigNumber> {
  private readonly provider: Provider;
  private readonly contracts: Contracts<TBigNumber>;

  public constructor (provider: Provider, contracts: Contracts<TBigNumber>) {
    this.provider = provider;
    this.contracts = contracts;
  }

  public async trade(tradeParams: TradeParams): Promise<void> {
    // TODO
  }
}

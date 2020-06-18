import { Augur } from '../Augur';
import { SubscriptionEventName } from '../constants';
import { Logs } from '../state';

export interface BestOfferOrder {
  price: string;
  shares: string;
}
export interface BestOffersOrders {
  [liquityPoolId: string]: {
    [outcome: number]: BestOfferOrder;
  };
}
export interface GetBestOffersParams {
  liquidityPools: string[];
}
export class BestOffer {
  private readonly augur: Augur;

  constructor(augur: Augur) {
    this.augur = augur;

    this.augur.events.subscribe(
      SubscriptionEventName.BulkOrderEvent,
      orderEvents => this.determinBestOfferForLiquidityPool(orderEvents)
    );
  }

  determinBestOfferForLiquidityPool(orders: Logs.ParsedOrderEventLog[]) {
    console.log(orders);
  }

  async getBestOffers(params: GetBestOffersParams): Promise<BestOffersOrders> {
    console.log(params);
    return {
      '0x333': {
        1: {
          price: '0.3',
          shares: '100'
        }
      }
    };
  }
}

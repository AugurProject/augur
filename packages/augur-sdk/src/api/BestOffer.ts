import { Augur } from '../Augur';
import { SubscriptionEventName } from '../constants';
import { Logs } from '../state';

export class BestOffer {
  private readonly augur: Augur;

  constructor(augur: Augur) {
    this.augur = augur;

    this.augur.events.subscribe(
      SubscriptionEventName.BulkOrderEvent,
      orderEvents => this.getBestOfferForMarketOrders(orderEvents)
    );
  }

  getBestOfferForMarketOrders(orders: Logs.ParsedOrderEventLog[]) {
    console.log(orders);
  }
}

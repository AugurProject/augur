import {
  ParsedOrderEventLog,
  OrderTypeHex,
  SubscriptionEventName,
} from '@augurproject/sdk-lite';
import { Augur } from '../Augur';
import * as _ from 'lodash';

export class MarketInvalidBids {
  private readonly augur: Augur;

  constructor(augur: Augur) {
    this.augur = augur;

    this.augur.events.on(
      SubscriptionEventName.BulkOrderEvent,
      (orderEvents) => this.getMarketInvalidBids(orderEvents)
    );
  }

  getMarketInvalidBids(orders: { logs: ParsedOrderEventLog[] }) {
    const onlyInvalidBids = orders.logs.filter(
      (o) => String(o.orderType) === OrderTypeHex.Bid && o.outcome === `0x00`
    );
    const markets = _.map(onlyInvalidBids, 'market');
    const marketIds = Array.from(new Set(markets));
    Promise.all(
      _.map(marketIds, async (marketId) => {
        return await this.augur.getMarketOrderBook({
          marketId,
          outcomeId: 0,
          orderType: '0',
        });
      })
    ).then((marketInvalidBidsUpdated) => {
      if (_.keys(marketInvalidBidsUpdated).length > 0) {
        this.augur.events.emit(
          SubscriptionEventName.MarketInvalidBids,
          { data: marketInvalidBidsUpdated }
        );
      }
    });
  }
}

import { ParsedOrderEventLog, OrderTypeHex, SubscriptionEventName, OrderEventType } from '@augurproject/sdk-lite';
import {
  ParsedOrderEventLog,
  OrderTypeHex,
  SubscriptionEventName,
  OrderEventType,
} from '@augurproject/sdk-lite';
import { Augur } from '../Augur';
import { BigNumber } from 'bignumber.js';
import * as _ from 'lodash';
import {
  MarketLiquidityPool,
  LiquidityPool,
} from '../state/getter/LiquidityPool';

export interface LiquidityPoolUpdated {
  [liquidityPoolId: string]: {
    [outcome: number]: {
      price: string;
      shares: string;
    }[];
  };
}

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

    this.augur.events.on(SubscriptionEventName.BulkOrderEvent, (orderEvents) =>
      this.determineBestOfferForLiquidityPool(orderEvents)
    );
  }

  determineBestOfferForLiquidityPool(orders: { logs: ParsedOrderEventLog[] }) {
    const onlyOffers = orders.logs.filter(
      (o) => String(o.orderType) === OrderTypeHex.Ask
    );
    const bestBulkOrders = this.getBestPricePerOutcomeInMarket(onlyOffers);
    const flatten: ParsedOrderEventLog[] = [];
    _.forOwn(bestBulkOrders, (market) => {
      _.forOwn(market, (outcome) => {
        flatten.push(outcome);
      });
    });
    Promise.all(
<<<<<<< HEAD
      _.map(flatten, async order => {
=======
      _.map(flatten, async (order) => {
>>>>>>> Add outcome placeholders sportsbook (#8398)
        const orderAdded = order.eventType === OrderEventType.Create;
        const poolBestPrice = await this.augur.getMarketOutcomeBestOffer({
          marketId: order.market,
          outcome: order.outcome,
        });
        const hasBestOffer = poolBestPrice && _.keys(poolBestPrice).length > 0;
<<<<<<< HEAD
        const bestPrice = hasBestOffer && poolBestPrice[_.first(_.keys(poolBestPrice))][order.outcome].price;
        // if outcome order is null, then no offers, send null for that outcome
        if (!poolBestPrice || !poolBestPrice[_.first(_.keys(poolBestPrice))][order.outcome]) {
          return poolBestPrice;
        }
        if (
          (orderAdded && hasBestOffer && new BigNumber(bestPrice).lte(new BigNumber(order.price))) ||
          (!orderAdded && new BigNumber(bestPrice).gte(new BigNumber(order.price)))
=======
        const bestPrice =
          hasBestOffer &&
          poolBestPrice[_.first(_.keys(poolBestPrice))][
            Number(new BigNumber(order.outcome))
          ].price;
        // if outcome order is null, then no offers, send null for that outcome
        if (
          !poolBestPrice ||
          !poolBestPrice[_.first(_.keys(poolBestPrice))][
            Number(new BigNumber(order.outcome))
          ]
        ) {
          return poolBestPrice;
        }
        if (
          (orderAdded &&
            hasBestOffer &&
            new BigNumber(bestPrice).lte(new BigNumber(order.price))) ||
          (!orderAdded &&
            new BigNumber(bestPrice).gte(new BigNumber(order.price)))
>>>>>>> Add outcome placeholders sportsbook (#8398)
        ) {
          return poolBestPrice;
        }
        return null;
      })
    ).then((liquiditPoolsUpdated) => {
      if (_.keys(liquiditPoolsUpdated).length > 0) {
        this.augur.events.emit(
          SubscriptionEventName.LiquidityPoolUpdated,
          liquiditPoolsUpdated
        );
      }
    });
  }

<<<<<<< HEAD
  convertToDisplayvalues = (liq: MarketLiquidityPool): any => {
    return _.keys(liq).reduce((pools, pool) => {
      const outcomes = _.keys(liq[pool]).reduce(
        (outcomes, outcome) => ({
          ...outcomes,
          [Number(new BigNumber(outcome))]: this.convertOrderToDisplayValues(
            liq[pool][outcome]
          ),
        }),
        {}
      );
      return { ...pools, [pool]: outcomes };
    }, {});
  };

  convertOrderToDisplayValues = order => {
    if (!order) return order;
    return {
    ...order,
    price: String(
      convertOnChainPriceToDisplayPrice(
        new BigNumber(order.price),
        CAT_MIN_PRICE,
        CAT_TICK_SIZE
      ).toFixed()
    ),
    shares: String(
      convertOnChainAmountToDisplayAmount(
        new BigNumber(order.shares),
        CAT_TICK_SIZE
      ).toFixed()
    ),
  }};

=======
>>>>>>> Add outcome placeholders sportsbook (#8398)
  getBestPricePerOutcomeInMarket = (onlyOffers: ParsedOrderEventLog[]) => {
    const marketIds: _.Dictionary<ParsedOrderEventLog[]> = _.groupBy(
      onlyOffers,
      'market'
    );
    return _.reduce(
      _.keys(marketIds),
      (agg, marketId) => {
        const outcomeOrders = _.groupBy(marketIds[marketId], 'outcome');
        const outcomeBestOffer = _.reduce(
          _.keys(outcomeOrders),
          (p, outcome) => {
            const offers = outcomeOrders[outcome];
            const bestOffer = offers.reduce(
              (lowerAsk, order) =>
                new BigNumber(order.price).lte(new BigNumber(lowerAsk.price))
                  ? lowerAsk
                  : order,
              _.first(offers)
            );
            return { ...p, [outcome]: bestOffer };
          },
          {}
        );
        return { ...agg, [marketId]: outcomeBestOffer };
      },
      {}
    );
  };
}

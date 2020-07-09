import { ParsedOrderEventLog, OrderTypeHex, SubscriptionEventName, OrderEventType } from '@augurproject/sdk-lite';
import {
  convertOnChainPriceToDisplayPrice,
  convertOnChainAmountToDisplayAmount,
} from '@augurproject/utils';
import { Augur } from '../Augur';
import { BigNumber } from 'bignumber.js';
import * as _ from 'lodash';
import { MarketLiquidityPool } from '../state/getter/LiquidityPool';

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
const CAT_TICK_SIZE = new BigNumber(0.01);
const CAT_MIN_PRICE = new BigNumber(0);
export class BestOffer {
  private readonly augur: Augur;

  constructor(augur: Augur) {
    this.augur = augur;

    this.augur.events.on(
      SubscriptionEventName.BulkOrderEvent,
      orderEvents => this.determineBestOfferForLiquidityPool(orderEvents)
    );
  }

  determineBestOfferForLiquidityPool(orders: {
    logs: ParsedOrderEventLog[];
  }) {
    const onlyOffers = orders.logs.filter(
      o => String(o.orderType) === OrderTypeHex.Ask
    );
    const bestBulkOrders = this.getBestPricePerOutcomeInMarket(onlyOffers);
    const flatten: ParsedOrderEventLog[] = [];
    _.forOwn(bestBulkOrders, market => {
      _.forOwn(market, outcome => {
        flatten.push(outcome);
      });
    });
    Promise.all(
      _.map(flatten, async order => {
        const orderAdded = order.eventType === OrderEventType.Create;
        const poolBestPrice = await this.augur.getMarketOutcomeBestOffer({
          marketId: order.market,
          outcome: order.outcome,
        });
        const hasBestOffer = poolBestPrice && _.keys(poolBestPrice).length > 0;
        const bestPrice = hasBestOffer && poolBestPrice[_.first(_.keys(poolBestPrice))][order.outcome].price;
        // if outcome order is null, then no offers, send null for that outcome
        if (!poolBestPrice || !poolBestPrice[_.first(_.keys(poolBestPrice))][order.outcome]) {
          return poolBestPrice;
        }
        if (
          (orderAdded && hasBestOffer && new BigNumber(bestPrice).lte(new BigNumber(order.price))) ||
          (!orderAdded && new BigNumber(bestPrice).gte(new BigNumber(order.price)))
        ) {
          return poolBestPrice;
        }
        return null;
      })
    ).then(updates => {
      const liquiditPoolsUpdated = _.reduce(
        updates,
        (p, liq) => (liq ? { ...p, ...this.convertToDisplayvalues(liq) } : p),
        {}
      );

      if (_.keys(liquiditPoolsUpdated).length > 0) {
        this.augur.events.emit(
          SubscriptionEventName.LiquidityPoolUpdated,
          liquiditPoolsUpdated
        );
      }
    });
  }

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

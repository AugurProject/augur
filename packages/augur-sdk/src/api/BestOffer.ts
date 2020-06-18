import { Augur } from '../Augur';
import { BigNumber } from 'bignumber.js';
import { SubscriptionEventName } from '../constants';
import { Logs } from '../state';
import { OrderTypeHex } from '../state/logs/types';
import * as _ from 'lodash';
import { MarketLiquidityPool } from '../state/getter/LiquidityPool';
import {
  convertOnChainPriceToDisplayPrice,
  convertOnChainAmountToDisplayAmount,
} from '../index';

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

    this.augur.events.subscribe(
      SubscriptionEventName.BulkOrderEvent,
      orderEvents => this.determineBestOfferForLiquidityPool(orderEvents)
    );
  }

  determineBestOfferForLiquidityPool(orders: {
    logs: Logs.ParsedOrderEventLog[];
  }) {
    console.log('order events', orders);
    const onlyOffers = orders.logs.filter(
      o => String(o.orderType) === OrderTypeHex.Ask
    );
    const bestBulkOrders = this.getBestPricePerOutcomeInMarket(onlyOffers);
    const flatten: Logs.ParsedOrderEventLog[] = [];
    _.forOwn(bestBulkOrders, market => {
      _.forOwn(market, outcome => {
        flatten.push(outcome);
      });
    });
    Promise.all(
      _.map(flatten, async order => {
        const poolBestPrice = await this.augur.getMarketOutcomeBestOffer({
          marketId: order.market,
          outcome: order.outcome,
        });
        if (
          poolBestPrice &&
          new BigNumber(
            poolBestPrice[_.first(_.keys(poolBestPrice))][order.outcome].price
          ).eq(new BigNumber(order.price))
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

      this.augur.events.emit(
        SubscriptionEventName.LiquidityPoolUpdated,
        liquiditPoolsUpdated
      );
      console.log('best offer', liquiditPoolsUpdated);
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

  convertOrderToDisplayValues = order => ({
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
  });

  getBestPricePerOutcomeInMarket = (onlyOffers: Logs.ParsedOrderEventLog[]) => {
    const marketIds: _.Dictionary<Logs.ParsedOrderEventLog[]> = _.groupBy(
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

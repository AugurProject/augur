import {
  MarketData,
  OrderTypeHex,
} from '@augurproject/sdk-lite';
import { DB } from '../db/DB';
import * as _ from 'lodash';
import { Augur } from '../../index';
import { BigNumber } from 'bignumber.js';
import { Getter } from './Router';
import * as t from 'io-ts';
import {
  convertOnChainPriceToDisplayPrice,
  convertOnChainAmountToDisplayAmount,
} from '@augurproject/utils';

export interface BestOfferOrder {
  price: string;
  shares: string;
}
export interface MarketLiquidityPool {
  [liquityPoolId: string]: {
    [outcome: number]: BestOfferOrder;
  };
}

export const MarketPoolBestOfferParam = t.type({
  liquidityPools: t.array(t.string),
});

export const MarketOutcomeBestOfferParam = t.type({
  marketId: t.string,
  outcome: t.string,
});

const CAT_TICK_SIZE = new BigNumber(0.01);
const CAT_MIN_PRICE = new BigNumber(0);

export class LiquidityPool {
  static getMarketsLiquidityPoolsParams = MarketPoolBestOfferParam;
  static GetMarketOutcomeBestOfferParams = MarketOutcomeBestOfferParam;

  @Getter('getMarketsLiquidityPoolsParams')
  static async getMarketsLiquidityPools(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof LiquidityPool.getMarketsLiquidityPoolsParams>
  ): Promise<MarketLiquidityPool> {
    const allMarketsInPools: MarketData[] = await db.Markets.where(
      'liquidityPool'
    )
      .anyOf(params.liquidityPools)
      .toArray();
    if (!allMarketsInPools || !allMarketsInPools.length) return null;
    const allPools = _.groupBy(allMarketsInPools, 'liquidityPool');
    let pools = {};
    for (let i = 0; i < _.keys(allPools).length; i++) {
      const liquidityPoolId = _.keys(allPools)[i];
      const marketIds = _.map(allPools[liquidityPoolId], 'market');
      const numOutcomes = _.first(allPools[liquidityPoolId])?.outcomes?.length;
      const pool = await LiquidityPool.getLiquidityPoolBestOffers(
        db,
        marketIds,
        numOutcomes
      );
      pools = {
        ...pools,
        [liquidityPoolId]: pool,
      };
    }
    return pools;
  }

  static async getLiquidityPoolBestOffers(
    db: DB,
    marketIds: string[],
    numOutcomes: number = 3
  ): Promise<{ [outcome: number]: BestOfferOrder }> {
    const orderType = OrderTypeHex.Ask;
    const outcomeIds = new Array(numOutcomes)
      .fill(undefined)
      .map((v, i) => `0x0${i}`);
    const unsortedOffers = await db.ZeroXOrders.where('market')
      .anyOfIgnoreCase(marketIds)
      .and((order) => order.orderType === orderType)
      .toArray();
    const groupedOutcomeUnsorted = _.groupBy(unsortedOffers, 'outcome');

    return _.reduce(
      outcomeIds,
      (pool, outcome) => {
        const outcomeOrders = groupedOutcomeUnsorted[outcome];
        if (!outcomeOrders)
          return { ...pool, [Number(new BigNumber(outcome))]: null };
        const bucketsByPrice = _.groupBy(
          groupedOutcomeUnsorted[outcome],
          (order) => order.price
        );
        const bestPrice = LiquidityPool.getOutcomesBestOffer(bucketsByPrice);
        return { ...pool, [Number(new BigNumber(outcome))]: bestPrice };
      },
      {}
    );
  }

  @Getter('GetMarketOutcomeBestOfferParams')
  static async getMarketOutcomeBestOffer(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof LiquidityPool.GetMarketOutcomeBestOfferParams>
  ): Promise<MarketLiquidityPool> {
    const orderType = OrderTypeHex.Ask;
    const outcome = params.outcome;
    const liqPool = await LiquidityPool.getPoolsOfMarkets(db, [
      params.marketId,
    ]);
    if (!liqPool || _.keys(liqPool).length === 0) return null;

    // market can only be in one liquidity pool
    const liquidityPoolId = _.first(_.keys(liqPool));
    const marketIds = _.map(_.first(_.values(liqPool)), 'market');

    // when getting orders need to use outcome number not hex value
    const unsortedOffers = await db.ZeroXOrders.where('market')
      .anyOfIgnoreCase(marketIds)
      .and(
        (order) => order.outcome === outcome && order.orderType === orderType
      )
      .toArray();

    const bucketsByPrice = _.groupBy(unsortedOffers, (order) => order.price);
    const bestPrice = LiquidityPool.getOutcomesBestOffer(bucketsByPrice);
    return {
      [liquidityPoolId]: {
        [Number(new BigNumber(outcome))]: bestPrice,
      },
    };
  }

  static async getPoolsOfMarkets(
    db: DB,
    marketIds: string[]
  ): Promise<_.Dictionary<MarketData[]>> {
    const markets: MarketData[] = await db.Markets.where('market')
      .anyOf(marketIds)
      .toArray();
    const liquidityPools = _.uniq(_.keys(_.groupBy(markets, 'liquidityPool')));
    const liquidityPoolsMarkets: MarketData[] = await db.Markets.where(
      'liquidityPool'
    )
      .anyOf(liquidityPools)
      .toArray();
    const allPools = _.groupBy(liquidityPoolsMarkets, 'liquidityPool');
    return allPools;
  }

  static getOutcomesBestOffer = (bucketsByPrice) => {
    const lastSortedOrder = Object.keys(bucketsByPrice).sort((a, b) =>
      new BigNumber(b).minus(a).toNumber()
    );

    const sortedOrders = lastSortedOrder.map((k) => bucketsByPrice[k]);
    for (let i = 0, size = sortedOrders.length; i < size; i++) {
      sortedOrders[i].sort(
        (a, b) => parseFloat(b.amount) - parseFloat(a.amount)
      );
    }

    const sortedOrderValues = _.values(sortedOrders);
    const size =
      sortedOrderValues && sortedOrderValues.length
        ? _.last(sortedOrderValues).reduce(
            (size, orders) => new BigNumber(orders.amount).plus(size),
            new BigNumber(0)
          )
        : 0;

    return lastSortedOrder && lastSortedOrder.length
      ? LiquidityPool.convertOrderToDisplayValues({
          price: _.last(lastSortedOrder),
          shares: String(size),
        })
      : null;
  };

  static convertOrderToDisplayValues = (order) => {
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
    };
  };
}

import { Order, OrderState, MarketData, OrderType, OrderTypeHex } from '@augurproject/sdk-lite';
import { DB } from '../db/DB';
import * as _ from 'lodash';
import { Augur } from '../../index';
import { BigNumber } from 'bignumber.js';
import { Getter } from './Router';
import { getMarkets }  from './OnChainTrading';
import { StoredOrder } from '../db/ZeroXOrders';
import Dexie from 'dexie';
import * as t from 'io-ts';
import { ZeroXOrdersGetters } from './ZeroXOrdersGetters';

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
  marketIds: t.array(t.string),
});

export const MarketOutcomeBestOfferParam = t.type({
  marketId: t.string,
  outcome: t.string,
});

export class LiquidityPool {
  static GetMarketPoolBestOfferParam = MarketPoolBestOfferParam;
  static GetMarketOutcomeBestOfferParams = MarketOutcomeBestOfferParam;

  //@Getter('GetMarketsLiquidityPoolParam')
  static async getMarketsLiquidityPool(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof LiquidityPool.GetMarketPoolBestOfferParam>
  ): Promise<MarketLiquidityPool> {
    // get outcomes and build liquidity pool
    const markets: MarketData[] = await db.Markets.where('market')
      .anyOf(params.marketIds)
      .toArray();
    const groupHashes = _.uniq(_.keys(_.keyBy(markets, 'groupHash')));
    const groupMarkets: MarketData[] = await db.Markets.where('groupHash')
      .anyOf(groupHashes)
      .toArray();
    const totalMarkets = _.uniq(_.keys(_.keyBy(groupMarkets, 'market')));
    const allMarketsInPools: MarketData[] = await db.Markets.where('market')
      .anyOf(totalMarkets)
      .toArray();
    const allPools = _.uniq(
      _.keys(_.keyBy(allMarketsInPools, 'liquidityPool'))
    );
    const getterParams = {};
    // return ZeroXOrdersGetters.getZeroXOrders(augur, db, params);
    return {
      '0x333': {
        1: {
          price: '0.3',
          shares: '100',
        },
      },
    };
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
      .and(order => order.outcome === outcome && order.orderType === orderType)
      .toArray();

    const bucketsByPrice = _.groupBy(unsortedOffers, order => order.price);

    const lastSortedOrder = Object.keys(bucketsByPrice).sort((a, b) =>
      new BigNumber(b).minus(a).toNumber()
    );

    const sortedOrders = lastSortedOrder.map(k => bucketsByPrice[k]);
    for (let i = 0, size = sortedOrders.length; i < size; i++) {
      sortedOrders[i].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    }

    const size = _.last(_.values(sortedOrders)).reduce(
      (size, orders) => new BigNumber(orders.amount).plus(size),
      new BigNumber(0)
    );
    const bestPrice = { price: _.last(lastSortedOrder), shares: String(size) };
    return {
      [liquidityPoolId]: {
        [outcome]: bestPrice,
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
}

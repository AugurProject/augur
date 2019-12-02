import { BigNumber } from 'bignumber.js';
import * as t from 'io-ts';
import { DB } from '../db/DB';
import { Getter } from './Router';
import { Augur } from '../../index';
import * as _ from 'lodash';

export const Order = t.type({
    price: t.string,
    amount: t.string,
});
  
export const OutcomeOrderBook = t.type({
    bids: t.array(Order),
    asks: t.array(Order),
});


export const OrderBook = t.dictionary(
    t.string,
    OutcomeOrderBook,
);

export const GetMarketLiquidityRankingParams = t.type({
    orderBook: OrderBook,
    numTicks: t.string,
    marketType: t.number,
    reportingFeeDivisor: t.string,
    feePerCashInAttoCash: t.string,
    numOutcomes: t.number,
    spread: t.number,
});

export interface MarketLiquidityRanking {
    marketRank: number;
    totalMarkets: number;
    hasLiquidity: boolean;
}

export class Liquidity {
  static getMarketLiquidityRankingParams = GetMarketLiquidityRankingParams;

  @Getter('getMarketLiquidityRankingParams')
  static async getMarketLiquidityRanking(augur: Augur, db: DB, params: t.TypeOf<typeof Liquidity.getMarketLiquidityRankingParams>): Promise<MarketLiquidityRanking> {
    const liquidityScore = await augur.liquidity.getLiquidityForSpread({
        orderBook: params.orderBook,
        numTicks: new BigNumber(params.numTicks),
        marketType: params.marketType,
        reportingFeeDivisor: new BigNumber(params.reportingFeeDivisor),
        feePerCashInAttoCash: new BigNumber(params.feePerCashInAttoCash),
        numOutcomes: params.numOutcomes,
        spread: params.spread,
    });
    const unfinalizedMarkets = await db.Markets.where("finalized").equals(0);
    const totalMarkets = await unfinalizedMarkets.count() + 1; // 1 to account for this theoretical market
    if (liquidityScore.isZero()) {
        return {
            marketRank: 0,
            totalMarkets,
            hasLiquidity: false
        };
    }
    const rankingMarkets = await unfinalizedMarkets.and((market) => {
        return market.liquidity[params.spread] > 0;
    }).toArray();
    const higherRankingMarkets = _.reduce(rankingMarkets, (numHigher, market) => {
        if (market.liquidity) {
            return numHigher + (liquidityScore.lt(market.liquidity[params.spread]) ? 1 : 0);
        }
        return numHigher;
    }, 0);
    return {
        marketRank: higherRankingMarkets + 1,
        totalMarkets,
        hasLiquidity: true 
    };
  }
}



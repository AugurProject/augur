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
    const totalMarkets = (await db.getNumRowsFromDB("Markets", true)); // Includes this market. Would otherwise have to -1 to remove the meta row
    if (liquidityScore.isZero()) {
        return {
            marketRank: 0,
            totalMarkets,
            hasLiquidity: false
        };
    }
    const key = `liquidity.${params.spread}`;
    const rankingMarkets = await db.findMarkets({
        selector: {
            [key]: { $gt: "0" }
        }
    });
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



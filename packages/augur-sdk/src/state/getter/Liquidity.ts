import {
  DEFAULT_GAS_PRICE_IN_GWEI,
  OrderBook,
  WORST_CASE_FILL,
} from '@augurproject/sdk-lite';
import { BigNumber } from 'bignumber.js';
import * as t from 'io-ts';
import * as _ from 'lodash';
import { Augur } from '../../index';
import { DB } from '../db/DB';
import { Getter } from './Router';

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
  static async getMarketLiquidityRanking(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Liquidity.getMarketLiquidityRankingParams>
  ): Promise<MarketLiquidityRanking> {
    // TODO Get ETH -> DAI price via uniswap when we integrate that as an oracle
    const ETHInAttoDAI = new BigNumber(200).multipliedBy(10 ** 18);
    const estimatedTradeGasCost = WORST_CASE_FILL[params.numOutcomes];
    const estimatedGasCost = ETHInAttoDAI.multipliedBy(
      DEFAULT_GAS_PRICE_IN_GWEI
    ).div(10 ** 9);
    const estimatedTradeGasCostInAttoDai = estimatedGasCost.multipliedBy(
      estimatedTradeGasCost
    );
    const liquidityScore = await augur.liquidity.getLiquidityForSpread({
      orderBook: params.orderBook,
      numTicks: new BigNumber(params.numTicks),
      marketType: params.marketType,
      reportingFeeDivisor: new BigNumber(params.reportingFeeDivisor),
      feePerCashInAttoCash: new BigNumber(params.feePerCashInAttoCash),
      numOutcomes: params.numOutcomes,
      spread: params.spread,
      estimatedTradeGasCostInAttoDai,
    });
    const unfinalizedMarkets = await db.Markets.where('finalized').equals(0);
    const totalMarkets = (await unfinalizedMarkets.count()) + 1; // 1 to account for this theoretical market
    if (liquidityScore.isZero()) {
      return {
        marketRank: 0,
        totalMarkets,
        hasLiquidity: false,
      };
    }
    const rankingMarkets = await unfinalizedMarkets
      .and(market => {
        return market.liquidity[params.spread] > 0;
      })
      .toArray();
    const higherRankingMarkets = _.reduce(
      rankingMarkets,
      (numHigher, market) => {
        if (market.liquidity) {
          return (
            numHigher +
            (liquidityScore.lt(market.liquidity[params.spread]) ? 1 : 0)
          );
        }
        return numHigher;
      },
      0
    );
    return {
      marketRank: higherRankingMarkets + 1,
      totalMarkets,
      hasLiquidity: true,
    };
  }
}

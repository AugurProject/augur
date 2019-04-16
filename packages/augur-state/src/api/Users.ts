import { BigNumber } from "bignumber.js";
import { DB } from "../db/DB";
import { Getter } from "./Router";
import { NumericDictionary } from "lodash";
import { ProfitLossChangedLog, OrderFilledLog } from '../logs/types';
import { numTicksToTickSize, convertOnChainAmountToDisplayAmount, convertOnChainPriceToDisplayPrice } from "@augurproject/api";
import { SortLimit } from './types';

import * as _ from "lodash";
import * as t from "io-ts";

const UserTradingPositionsParams = t.intersection([t.type({
  account: t.string,
}), t.partial({
  universe: t.string,
  marketId: t.string,
  outcome: t.number,
})]);

const GetProfitLossSummaryParams = t.partial({
  universe: t.string,
  account: t.string,
  marketId: t.string,
  endTime: t.number,
});

const GetProfitLossParams = t.intersection([GetProfitLossSummaryParams, t.partial({
  startTime: t.number,
  periodInterval: t.number,
  outcome: t.number,
})]);

export interface MarketTradingPosition {
  timestamp: number;
  frozenFunds: string;
  marketId: string;
  realized: string; // realized profit in tokens (eg. ETH) user already got from this market outcome. "realized" means the user bought/sold shares in such a way that the profit is already in the user's wallet
  unrealized: string; // unrealized profit in tokens (eg. ETH) user could get from this market outcome. "unrealized" means the profit isn't in the user's wallet yet; the user could close the position to "realize" the profit, but instead is holding onto the shares. Computed using last trade price.
  total: string; // total profit in tokens (eg. ETH). Always equal to realized + unrealized
  unrealizedCost: string; // denominated in tokens. Cost of shares in netPosition
  realizedCost: string; // denominated in tokens. Cumulative cost of shares included in realized profit
  totalCost: string; // denominated in tokens. Always equal to unrealizedCost + realizedCost
  realizedPercent: string; // realized profit percent (ie. profit/cost)
  unrealizedPercent: string; // unrealized profit percent (ie. profit/cost)
  totalPercent: string; // total profit percent (ie. profit/cost)
  currentValue: string; // current value of netPosition, always equal to unrealized minus frozenFunds
}

export interface TradingPosition {
  timestamp: number;
  position: string;
  frozenFunds: string;
  marketId: string; // user's position is in this market
  outcome: number; // user's position is in this market outcome
  netPosition: string; // current quantity of shares in user's position for this market outcome. "net" position because if user bought 4 shares and sold 6 shares, netPosition would be -2 shares (ie. 4 - 6 = -2). User is "long" this market outcome (gets paid if this outcome occurs) if netPosition is positive. User is "short" this market outcome (gets paid if this outcome does not occur) if netPosition is negative
  averagePrice: string; // denominated in tokens/share. average price user paid for shares in the current open position
  realized: string; // realized profit in tokens (eg. ETH) user already got from this market outcome. "realized" means the user bought/sold shares in such a way that the profit is already in the user's wallet
  unrealized: string; // unrealized profit in tokens (eg. ETH) user could get from this market outcome. "unrealized" means the profit isn't in the user's wallet yet; the user could close the position to "realize" the profit, but instead is holding onto the shares. Computed using last trade price.
  total: string; // total profit in tokens (eg. ETH). Always equal to realized + unrealized
  unrealizedCost: string; // denominated in tokens. Cost of shares in netPosition
  realizedCost: string; // denominated in tokens. Cumulative cost of shares included in realized profit
  totalCost: string; // denominated in tokens. Always equal to unrealizedCost + realizedCost
  realizedPercent: string; // realized profit percent (ie. profit/cost)
  unrealizedPercent: string; // unrealized profit percent (ie. profit/cost)
  totalPercent: string; // total profit percent (ie. profit/cost)
  currentValue: string; // current value of netPosition, always equal to unrealized minus frozenFunds
}

export interface UserTradingPositions {
  tradingPositions: Array<TradingPosition>; // per-outcome TradingPosition, where unrealized profit is relative to an outcome's last price (as traded by anyone)
  tradingPositionsPerMarket: { // per-market rollup of trading positions
    [marketId: string]: MarketTradingPosition,
  };
  frozenFundsTotal: string; // User's total frozen funds. See docs on FrozenFunds. This total includes market validity bonds in addition to sum of frozen funds for all market outcomes in which user has a position.
}

export class Users<TBigNumber> {
  public static GetUserTradingPositionsParams = t.intersection([UserTradingPositionsParams, SortLimit]);

  @Getter("GetUserTradingPositionsParams")
  public static async getUserTradingPositions<TBigNumber>(db: DB<TBigNumber>, params: t.TypeOf<typeof Users.GetUserTradingPositionsParams>): Promise<UserTradingPositions> {
    if (!params.universe && !params.marketId) {
      throw new Error("'getTradingHistory' requires a 'universe' or 'marketId' param be provided");
    }
    const request = {
      selector: {
        universe: params.universe,
        market: params.marketId,
        account: params.account,
      },
      sort: params.sortBy ? [params.sortBy] : undefined,
      limit: params.limit,
      skip: params.offset,
    };
    const profitLossResult = await db.findProfitLossChangedLogs(params.account, request);
    const profitLossResultsByMarket = _.groupBy(profitLossResult, "market");
    const profitLossResultsByMarketAndOutcome = _.mapValues(profitLossResultsByMarket, (profitLossResults) => {
      const outcomeProfitLossResultsInMarket = _.groupBy(profitLossResults, "outcome");
      return _.mapValues(outcomeProfitLossResultsInMarket, (outcomeProfitLossResults) => {
        return _.reduce(outcomeProfitLossResults, (latestProfitLossResult: ProfitLossChangedLog, outcomeProfitLossResult) => {
          if (!latestProfitLossResult || new BigNumber(latestProfitLossResult._id).lt(new BigNumber(outcomeProfitLossResult._id))) {
            return outcomeProfitLossResult;
          }
          return latestProfitLossResult;
        }, null);
      });
    });

    const orderFilledRequest = {
      selector: {
        universe: params.universe,
        marketId: params.marketId,
        $or: [
          { creator: params.account },
          { filler: params.account }
        ]
      }
    }
    const orderFilled = await db.findOrderFilledLogs(orderFilledRequest);
    const ordersFilledByMarket = _.groupBy(orderFilled, "marketId");
    const ordersFilledResultsByMarketAndOutcome = _.mapValues(ordersFilledByMarket, (orderFilledResults) => {
      const outcomeOrderFilledResultsInMarket = _.groupBy(orderFilledResults, "outcome");
      return _.mapValues(outcomeOrderFilledResultsInMarket, (outcomeOrderFilledResults) => {
        return _.reduce(outcomeOrderFilledResults, (latestOrderFilledResult: OrderFilledLog, outcomeOrderFilledResult) => {
          if (!latestOrderFilledResult || latestOrderFilledResult._id < outcomeOrderFilledResult._id) {
            return outcomeOrderFilledResult;
          }
          return latestOrderFilledResult;
        }, null);
      });
    });

    const marketIds = _.keys(profitLossResultsByMarket);
    const marketsResponse = await db.findMarketCreatedLogs({ selector: { market: { $in: marketIds } } });
    const markets = _.keyBy(marketsResponse, "market");

    const shareTokenBalances = await db.findTokenBalanceChangedLogs(params.account, {selector: {
      universe: params.universe,
      owner: params.account,
      tokenType: 1 // ShareToken  TODO: Get from constants somewhere
    }});
    const shareTokenBalancesByMarket = _.groupBy(shareTokenBalances, "market");
    const shareTokenBalancesByMarketandOutcome = _.mapValues(shareTokenBalancesByMarket, (marketShares) => {
      return _.keyBy(marketShares, "outcome");
    });

    // map Latest PLs to Trading Positions
    const tradingPositionsByMarketAndOutcome = _.mapValues(profitLossResultsByMarketAndOutcome, (profitLossResultsByOutcome) => {
      return _.mapValues(profitLossResultsByOutcome, (profitLossResult: ProfitLossChangedLog) => {
        const marketDoc = markets[profitLossResult.market];
        if (!marketDoc) return null;
        const minPrice = new BigNumber(marketDoc.minPrice);
        const maxPrice = new BigNumber(marketDoc.maxPrice);
        const numTicks = new BigNumber(marketDoc.numTicks);
        const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);

        const onChainFrozenFunds = new BigNumber(profitLossResult.frozenFunds);
        const onChainNetPosition = new BigNumber(profitLossResult.netPosition);
        const onChainAvgPrice = new BigNumber(profitLossResult.avgPrice);
        const onChainRealizedProfit = new BigNumber(profitLossResult.realizedProfit);
        const onChainRealizedCost = new BigNumber(profitLossResult.realizedCost);
        const onChainAvgCost = onChainNetPosition.isNegative() ? numTicks.minus(onChainAvgPrice) : onChainAvgPrice;
        const onChainUnrealizedCost = onChainNetPosition.abs().multipliedBy(onChainAvgCost);

        const frozenFunds = onChainFrozenFunds.dividedBy(10 ** 18);
        const netPosition: BigNumber = convertOnChainAmountToDisplayAmount(onChainNetPosition, tickSize);
        const realizedProfit = onChainRealizedProfit.dividedBy(10 ** 18);
        const avgPrice: BigNumber = convertOnChainPriceToDisplayPrice(onChainAvgPrice, minPrice, tickSize);
        const realizedCost = onChainRealizedCost.dividedBy(10 ** 18);
        const unrealizedCost = onChainUnrealizedCost.dividedBy(10 ** 18);

        const onChainLastTradePrice = new BigNumber(ordersFilledResultsByMarketAndOutcome[profitLossResult.market][profitLossResult.outcome]!.price);
        const lastTradePrice: BigNumber = convertOnChainPriceToDisplayPrice(onChainLastTradePrice, minPrice, tickSize);
        const unrealized = netPosition.abs().multipliedBy(onChainNetPosition.isNegative() ? avgPrice.minus(lastTradePrice) : lastTradePrice.minus(avgPrice));
        const realizedPercent = realizedProfit.dividedBy(realizedCost);
        const unrealizedPercent = unrealized.dividedBy(unrealizedCost);
        const totalPercent = realizedProfit.plus(unrealized).dividedBy(realizedCost.plus(unrealizedCost));

        let rawPosition = new BigNumber(0);
        if (shareTokenBalancesByMarketandOutcome[profitLossResult.market][profitLossResult.outcome]) {
          rawPosition = new BigNumber(shareTokenBalancesByMarketandOutcome[profitLossResult.market][profitLossResult.outcome].balance);
        }
        return {
          timestamp: new BigNumber(profitLossResult.timestamp).toNumber(),
          position: rawPosition.toFixed(),
          frozenFunds: frozenFunds.toFixed(),
          marketId: profitLossResult.market,
          outcome: new BigNumber(profitLossResult.outcome).toNumber(),
          netPosition: netPosition.toFixed(),
          averagePrice: avgPrice.toFixed(),
          realized: realizedProfit.toFixed(),
          unrealized: unrealized.toFixed(),
          total: realizedProfit.plus(unrealized).toFixed(),
          unrealizedCost: unrealizedCost.toFixed(),
          realizedCost: realizedCost.toFixed(),
          totalCost: unrealizedCost.plus(realizedCost).toFixed(),
          realizedPercent: realizedPercent.toFixed(),
          unrealizedPercent: unrealizedPercent.toFixed(),
          totalPercent: totalPercent.toFixed(),
          currentValue: unrealized.minus(frozenFunds).toFixed(),
        } as TradingPosition;
      });
    });

    // TODO add raw token balances that have no PL data for third party client integration to work ok.

    const tradingPositions = _.flatten(_.values(_.mapValues(tradingPositionsByMarketAndOutcome, _.values)));

    const marketTradingPositions = _.mapValues(tradingPositionsByMarketAndOutcome, (tradingPositionsByOutcome) => {
      const tradingPositions = _.values(_.omitBy(tradingPositionsByOutcome, _.isNull));
      return sumTradingPositions(tradingPositions);
    })

    const frozenFundsTotal = _.reduce(tradingPositions, (value, tradingPosition) => { return value.plus(tradingPosition.frozenFunds); }, new BigNumber(0));
    // TODO add market validity bond to total. Need to send a log for this since it is variable over time.

    return {
      tradingPositions,
      tradingPositionsPerMarket: marketTradingPositions,
      frozenFundsTotal: frozenFundsTotal.toFixed()
    };
  }

  @Getter("GetUserTradingPositionsParams")
  public static async getProfitLoss(params: t.TypeOf<typeof Users.GetUserTradingPositionsParams>): Promise<Array<TradingPosition>> {
    // TODO
    return [];
  }

  @Getter("GetUserTradingPositionsParams")
  public static async getProfitLossSummary(params: t.TypeOf<typeof Users.GetUserTradingPositionsParams>): Promise<NumericDictionary<TradingPosition>> {
    // TODO
    return {};
  }
}

export function sumTradingPositions(tradingPositions: Array<MarketTradingPosition>): MarketTradingPosition {
  const summedTrade = _.reduce(tradingPositions, (resultPosition, tradingPosition) => {
    const frozenFunds = new BigNumber(resultPosition.frozenFunds).plus(tradingPosition.frozenFunds);
    const realized = new BigNumber(resultPosition.realized).plus(tradingPosition.realized);
    const unrealized = new BigNumber(resultPosition.unrealized).plus(tradingPosition.unrealized);
    const realizedCost = new BigNumber(resultPosition.realizedCost).plus(tradingPosition.realizedCost);
    const unrealizedCost = new BigNumber(resultPosition.unrealizedCost).plus(tradingPosition.unrealizedCost);

    return {
      timestamp: tradingPosition.timestamp,
      frozenFunds: frozenFunds.toFixed(),
      marketId: tradingPosition.marketId,
      realized: realized.toFixed(),
      unrealized: unrealized.toFixed(),
      total: "0",
      unrealizedCost: unrealizedCost.toFixed(),
      realizedCost: realizedCost.toFixed(),
      totalCost: "0",
      realizedPercent: "0",
      unrealizedPercent: "0",
      totalPercent: "0",
      currentValue: "0",
    };
  }, {
    timestamp: 0,
    frozenFunds: "0",
    marketId: "",
    realized: "0",
    unrealized: "0",
    total: "0",
    unrealizedCost: "0",
    realizedCost: "0",
    totalCost: "0",
    realizedPercent: "0",
    unrealizedPercent: "0",
    totalPercent: "0",
    currentValue: "0",
  } as MarketTradingPosition);

  const frozenFunds = new BigNumber(summedTrade.frozenFunds);
  const realized = new BigNumber(summedTrade.realized);
  const unrealized = new BigNumber(summedTrade.unrealized);
  const realizedCost = new BigNumber(summedTrade.realizedCost);
  const unrealizedCost = new BigNumber(summedTrade.unrealizedCost);

  const total = realized.plus(unrealized);
  const totalCost = realizedCost.plus(unrealizedCost);

  summedTrade.total = total.toFixed();
  summedTrade.totalCost = totalCost.toFixed();
  summedTrade.realizedPercent = realizedCost.isZero() ? "0" : realized.dividedBy(realizedCost).toFixed();
  summedTrade.unrealizedPercent = unrealizedCost.isZero() ? "0" : unrealized.dividedBy(unrealizedCost).toFixed();
  summedTrade.totalPercent = totalCost.isZero() ? "0" : total.dividedBy(totalCost).toFixed();
  summedTrade.currentValue = unrealized.minus(frozenFunds).toFixed();

  return summedTrade;
}

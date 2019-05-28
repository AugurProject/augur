import { BigNumber } from "bignumber.js";
import { DB } from "../db/DB";
import { Getter } from "./Router";
import { NumericDictionary } from "lodash";
import { ProfitLossChangedLog, OrderEventLog, Doc, Timestamped, MarketCreatedLog, OrderEventUint256Value, ORDER_EVENT_CREATOR, ORDER_EVENT_FILLER, ORDER_EVENT_TIMESTAMP, ORDER_EVENT_OUTCOME } from '../logs/types';
import { Augur, numTicksToTickSize, convertOnChainAmountToDisplayAmount, convertOnChainPriceToDisplayPrice } from "../../index";
import { SortLimit } from './types';
import { ethers } from "ethers";

import * as _ from "lodash";
import * as t from "io-ts";

const DEFAULT_NUMBER_OF_BUCKETS = 30;

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
  marketId: string;
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

export interface ProfitLossResult {
  timestamp: number;
  position: string;
  averagePrice: string;
  cost: string;
  realized: string;
  unrealized: string;
  total: string;
}

export class Users {
  public static GetUserTradingPositionsParams = t.intersection([UserTradingPositionsParams, SortLimit]);
  public static GetProfitLossParams = GetProfitLossParams;
  public static GetProfitLossSummaryParams = GetProfitLossSummaryParams;

  @Getter("GetUserTradingPositionsParams")
  public static async getUserTradingPositions(augur: Augur, db: DB, params: t.TypeOf<typeof Users.GetUserTradingPositionsParams>): Promise<UserTradingPositions> {
    if (!params.universe && !params.marketId) {
      throw new Error("'getUserTradingPositions' requires a 'universe' or 'marketId' param be provided");
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

    const profitLossResultsByMarketAndOutcome = reduceMarketAndOutcomeDocsToOnlyLatest(await getProfitLossRecordsByMarketAndOutcome(db, params.account, request));

    const orderFilledRequest = {
      selector: {
        universe: params.universe,
        market: params.marketId,
        $or: [
          { [ORDER_EVENT_CREATOR]: params.account },
          { [ORDER_EVENT_FILLER]: params.account },
        ],
      }
    }

    const ordersFilledResultsByMarketAndOutcome = reduceMarketAndOutcomeDocsToOnlyLatest(await getOrderFilledRecordsByMarketAndOutcome(db, orderFilledRequest));

    const marketIds = _.keys(profitLossResultsByMarketAndOutcome);
    const marketsResponse = await db.findMarketCreatedLogs({ selector: { market: { $in: marketIds } } });
    const markets = _.keyBy(marketsResponse, "market");

    const marketFinalizedRequest = {
      selector: {
        universe: params.universe,
        market: { $in: marketIds }
      }
    }

    const marketFinalizedResults = await db.findMarketFinalizedLogs(marketFinalizedRequest);
    const marketFinalizedByMarket = _.keyBy(marketFinalizedResults, "market");

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
        let outcomeValue = new BigNumber(ordersFilledResultsByMarketAndOutcome[profitLossResult.market][profitLossResult.outcome]!.uint256Data[OrderEventUint256Value.price]);
        if (marketFinalizedByMarket[profitLossResult.market]) {
          outcomeValue = new BigNumber(marketFinalizedByMarket[profitLossResult.market].winningPayoutNumerators[new BigNumber(profitLossResult.outcome).toNumber()]);
        }
        const tradingPosition = getTradingPositionFromProfitLossFrame(profitLossResult, marketDoc, outcomeValue, 0);
        let rawPosition = new BigNumber(0);
        if (shareTokenBalancesByMarketandOutcome[profitLossResult.market][profitLossResult.outcome]) {
          rawPosition = new BigNumber(shareTokenBalancesByMarketandOutcome[profitLossResult.market][profitLossResult.outcome].balance);
        }
        tradingPosition.position = rawPosition.toFixed();
        return tradingPosition;
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

  @Getter("GetProfitLossParams")
  public static async getProfitLoss(augur: Augur, db: DB, params: t.TypeOf<typeof Users.GetProfitLossParams>): Promise<Array<MarketTradingPosition>> {
    if (!params.startTime) {
      throw new Error("'getProfitLoss' requires a 'startTime' param be provided");
    }
    const now = await augur.contracts.augur.getTimestamp_();
    const startTime = params.startTime!;
    const endTime = params.endTime || now.toNumber();
    const periodInterval = params.periodInterval === undefined ? Math.ceil((endTime - startTime) / DEFAULT_NUMBER_OF_BUCKETS) : params.periodInterval;

    const profitLossRequest = {
      selector: {
        universe: params.universe,
        account: params.account,
        $and: [
          { timestamp: { $lte: `0x${endTime.toString(16)}` } },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } }
        ]
      },
    };
    const profitLossByMarketAndOutcome = await getProfitLossRecordsByMarketAndOutcome(db, params.account!, profitLossRequest);

    const orderFilledRequest = {
      selector: {
        universe: params.universe,
        $or: [
          { [ORDER_EVENT_CREATOR]: params.account },
          { [ORDER_EVENT_FILLER]: params.account },
        ],
        $and: [
          { [ORDER_EVENT_TIMESTAMP]: { $lte: `0x${endTime.toString(16)}` } },
          { [ORDER_EVENT_TIMESTAMP]: { $gte: `0x${startTime.toString(16)}` } }
        ]
      },
    }
    const ordersFilledResultsByMarketAndOutcome = await getOrderFilledRecordsByMarketAndOutcome(db, orderFilledRequest);

    const marketIds = _.keys(profitLossByMarketAndOutcome);

    const marketFinalizedRequest = {
      selector: {
        universe: params.universe,
        market: { $in: marketIds },
        $and: [
          { timestamp: { $lte: `0x${endTime.toString(16)}` } },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } }
        ]
      }
    }

    const marketFinalizedResults = await db.findMarketFinalizedLogs(marketFinalizedRequest);
    const marketFinalizedByMarket = _.keyBy(marketFinalizedResults, "market");

    const marketsResponse = await db.findMarketCreatedLogs({ selector: { market: { $in: marketIds } } });
    const markets = _.keyBy(marketsResponse, "market");

    const buckets = bucketRangeByInterval(startTime, endTime, periodInterval);

    return _.map(buckets, (bucketTimestamp) => {
      const tradingPositionsByMarketAndOutcome = _.mapValues(profitLossByMarketAndOutcome, (profitLossByOutcome, marketId) => {
        const marketDoc = markets[marketId];
        return _.mapValues(profitLossByOutcome, (outcomePLValues, outcome) => {
          let latestOutcomePLValue = getLastDocBeforeTimestamp<ProfitLossChangedLog>(outcomePLValues, bucketTimestamp);
          if (!latestOutcomePLValue) {
            return {
              timestamp: bucketTimestamp,
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
            };
          }
          const outcomeValues = ordersFilledResultsByMarketAndOutcome[marketId][outcome];
          let outcomeValue = new BigNumber(getLastDocBeforeTimestamp<OrderEventLog>(outcomeValues, bucketTimestamp)!.uint256Data[OrderEventUint256Value.price]);
          if (marketFinalizedByMarket[marketId] && bucketTimestamp.lte(marketFinalizedByMarket[marketId].timestamp)) {
            outcomeValue = new BigNumber(marketFinalizedByMarket[marketId].winningPayoutNumerators[new BigNumber(outcome).toNumber()]);
          }
          return getTradingPositionFromProfitLossFrame(latestOutcomePLValue, marketDoc, outcomeValue, bucketTimestamp.toNumber());
        });
      })

      const tradingPositions: Array<MarketTradingPosition> = _.flattenDeep(_.map(_.values(tradingPositionsByMarketAndOutcome), _.values));
      return sumTradingPositions(tradingPositions);
    });
  }

  @Getter("GetProfitLossSummaryParams")
  public static async getProfitLossSummary(augur: Augur, db: DB, params: t.TypeOf<typeof Users.GetProfitLossSummaryParams>): Promise<NumericDictionary<MarketTradingPosition>> {
    const result: NumericDictionary<MarketTradingPosition> = {};
    const now = await augur.contracts.augur.getTimestamp_();
    const endTime = params.endTime || now.toNumber();
    for (const days of [1, 30]) {
      const periodInterval = days * 60 * 60 * 24;
      const startTime = endTime - periodInterval;

      const [startProfit, endProfit, ...rest] = await Users.getProfitLoss(augur, db, {
        universe: params.universe,
        account: params.account,
        startTime,
        endTime,
        periodInterval,
      });

      if (rest.length !== 0) throw new Error("PL calculation in summary returning more thant two bucket");

      const negativeStartProfit: MarketTradingPosition = {
        timestamp: startProfit.timestamp,
        realized: new BigNumber(startProfit.realized).negated().toFixed(),
        unrealized: new BigNumber(startProfit.unrealized).negated().toFixed(),
        frozenFunds: "0",
        marketId: "",
        total: "0",
        unrealizedCost: "0",
        realizedCost: "0",
        totalCost: "0",
        realizedPercent: "0",
        unrealizedPercent: "0",
        totalPercent: "0",
        currentValue: "0",
      };

      result[days] = sumTradingPositions([endProfit, negativeStartProfit]);
    }

    return result;
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

function bucketRangeByInterval(startTime: number, endTime: number, periodInterval: number | null): Array<BigNumber> {
  if (startTime < 0) throw new Error("startTime must be a valid unix timestamp, greater than 0");
  if (endTime < 0) throw new Error("endTime must be a valid unix timestamp, greater than 0");
  if (endTime < startTime) throw new Error("endTime must be greater than or equal startTime");
  if (periodInterval !== null && periodInterval <= 0) throw new Error("periodInterval must be positive integer (seconds)");

  const interval = periodInterval == null ? Math.ceil((endTime - startTime) / DEFAULT_NUMBER_OF_BUCKETS) : periodInterval;

  const buckets: Array<BigNumber> = [];
  for (let bucketEndTime = startTime; bucketEndTime < endTime; bucketEndTime += interval) {
    buckets.push(new BigNumber(bucketEndTime));
  }
  buckets.push(new BigNumber(endTime));

  return buckets;
}

async function getProfitLossRecordsByMarketAndOutcome(db: DB, account: string, request: PouchDB.Find.FindRequest<{}>): Promise<_.Dictionary<_.Dictionary<Array<ProfitLossChangedLog>>>> {
  const profitLossResult = await db.findProfitLossChangedLogs(account, request);
  return groupDocumentsByMarketAndOutcome<ProfitLossChangedLog>(profitLossResult);
}

async function getOrderFilledRecordsByMarketAndOutcome(db: DB, request: PouchDB.Find.FindRequest<{}>): Promise<_.Dictionary<_.Dictionary<Array<OrderEventLog>>>> {
  const orderFilled = await db.findOrderFilledLogs(request);
  return groupDocumentsByMarketAndOutcome<OrderEventLog>(orderFilled, ORDER_EVENT_OUTCOME);
}

function groupDocumentsByMarketAndOutcome<TDoc extends Doc>(docs: Array<TDoc>, outcomeField: string = "outcome"): _.Dictionary<_.Dictionary<Array<TDoc>>> {
  const byMarket = _.groupBy(docs, "market");
  return _.mapValues(byMarket, (marketResult) => {
    const outcomeResultsInMarket = _.groupBy(marketResult, outcomeField);
    return _.mapValues(outcomeResultsInMarket, (outcomeResults) => {
      return _.sortBy(outcomeResults, "_id");
    });
  });
}

function reduceMarketAndOutcomeDocsToOnlyLatest<TDoc extends Doc>(docs: _.Dictionary<_.Dictionary<Array<TDoc>>>): _.Dictionary<_.Dictionary<TDoc>> {
  return _.mapValues(docs, (marketResults) => {
    return _.mapValues(marketResults, (outcomeResults) => {
      return _.reduce(outcomeResults, (latestResult: TDoc, outcomeResult) => {
        if (!latestResult || new BigNumber(latestResult._id).lt(new BigNumber(outcomeResult._id))) {
          return outcomeResult;
        }
        return latestResult;
      }, outcomeResults[0]);
    });
  });
}

function getLastDocBeforeTimestamp<TDoc extends Timestamped>(docs: Array<TDoc>, timestamp: BigNumber): TDoc | undefined {
  let allBeforeTimestamp = _.takeWhile(docs, (doc) => timestamp.gte(doc.timestamp, 16));
  if (allBeforeTimestamp.length > 0) {
    return _.last(allBeforeTimestamp);
  }
  return undefined;
}

function getTradingPositionFromProfitLossFrame(profitLossFrame: ProfitLossChangedLog, marketDoc: MarketCreatedLog, onChainOutcomeValue: BigNumber, timestamp: number): TradingPosition {
  const minPrice = new BigNumber(marketDoc.prices[0]);
  const maxPrice = new BigNumber(marketDoc.prices[1]);
  const numTicks = new BigNumber(marketDoc.numTicks);
  const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);

  const onChainFrozenFunds = new BigNumber(profitLossFrame.frozenFunds);
  const onChainNetPosition = new BigNumber(profitLossFrame.netPosition);
  const onChainAvgPrice = new BigNumber(profitLossFrame.avgPrice);
  const onChainRealizedProfit = new BigNumber(profitLossFrame.realizedProfit);
  const onChainRealizedCost = new BigNumber(profitLossFrame.realizedCost);
  const onChainAvgCost = onChainNetPosition.isNegative() ? numTicks.minus(onChainAvgPrice) : onChainAvgPrice;
  const onChainUnrealizedCost = onChainNetPosition.abs().multipliedBy(onChainAvgCost);

  const frozenFunds = onChainFrozenFunds.dividedBy(10 ** 18);
  const netPosition: BigNumber = convertOnChainAmountToDisplayAmount(onChainNetPosition, tickSize);
  const realizedProfit = onChainRealizedProfit.dividedBy(10 ** 18);
  const avgPrice: BigNumber = convertOnChainPriceToDisplayPrice(onChainAvgPrice, minPrice, tickSize);
  const realizedCost = onChainRealizedCost.dividedBy(10 ** 18);
  const unrealizedCost = onChainUnrealizedCost.dividedBy(10 ** 18);

  const lastTradePrice: BigNumber = convertOnChainPriceToDisplayPrice(onChainOutcomeValue, minPrice, tickSize);
  const unrealized = netPosition.abs().multipliedBy(onChainNetPosition.isNegative() ? avgPrice.minus(lastTradePrice) : lastTradePrice.minus(avgPrice));
  const realizedPercent = realizedProfit.dividedBy(realizedCost);
  const unrealizedPercent = unrealized.dividedBy(unrealizedCost);
  const totalPercent = realizedProfit.plus(unrealized).dividedBy(realizedCost.plus(unrealizedCost));

  return {
    timestamp,
    position: "0",
    frozenFunds: frozenFunds.toFixed(),
    marketId: profitLossFrame.market,
    outcome: new BigNumber(profitLossFrame.outcome).toNumber(),
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
}

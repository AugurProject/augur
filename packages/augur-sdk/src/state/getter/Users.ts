import { BigNumber } from 'bignumber.js';
import { DB } from '../db/DB';
import { Getter } from './Router';
import { NumericDictionary } from 'lodash';
import {
  ProfitLossChangedLog,
  ParsedOrderEventLog,
  Doc,
  Timestamped,
  MarketCreatedLog,
} from '../logs/types';
import {
  DisputeCrowdsourcerRedeemed,
  MarketFinalized,
  OrderEvent,
  ProfitLossChanged,
} from '../../event-handlers';
import {
  Augur,
  numTicksToTickSize,
  convertOnChainAmountToDisplayAmount,
  convertOnChainPriceToDisplayPrice,
} from '../../index';
import { sortOptions } from './types';

import * as _ from 'lodash';
import * as t from 'io-ts';
import { QUINTILLION } from '../../utils';

const DEFAULT_NUMBER_OF_BUCKETS = 30;

const userTradingPositionsParams = t.intersection([
  t.type({
    account: t.string,
  }),
  t.partial({
    universe: t.string,
    marketId: t.string,
    outcome: t.number,
  }),
]);

const getProfitLossSummaryParams = t.partial({
  universe: t.string,
  account: t.string,
  endTime: t.number,
});

const getProfitLossParams = t.intersection([
  getProfitLossSummaryParams,
  t.partial({
    startTime: t.number,
    periodInterval: t.number,
    outcome: t.number,
  }),
]);

export interface AccountTimeRangedStatsResult {
  // Yea. The ProfitLossChanged event then
  // Sum of unique entries (defined by market + outcome) with non-zero netPosition
  positions: number;

  // OrderEvent table for fill events (eventType == 3) where they are the orderCreator or orderFiller address
  // if multiple fills in the same tx count as one trade then also counting just the unique tradeGroupId from those
  numberOfTrades: number;

  marketsCreated: number;

  // Trades? uniq the market
  marketsTraded: number;

  // DisputeCrowdsourcerRedeemed where the payoutNumerators match the MarketFinalized winningPayoutNumerators
  successfulDisputes: number;

  // For getAccountTimeRangedStats.redeemedPositions use the InitialReporterRedeemed and DisputeCrowdsourcerRedeemed log?
  redeemedPositions: number;
}

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
  frozenFunds: string;
  marketId: string;
  outcome: number; // user's position is in this market outcome
  netPosition: string; // current quantity of shares in user's position for this market outcome. "net" position because if user bought 4 shares and sold 6 shares, netPosition would be -2 shares (ie. 4 - 6 = -2). User is "long" this market outcome (gets paid if this outcome occurs) if netPosition is positive. User is "short" this market outcome (gets paid if this outcome does not occur) if netPosition is negative
  rawPosition: string; // non synthetic, actual shares on outcome
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
  tradingPositions: TradingPosition[]; // per-outcome TradingPosition, where unrealized profit is relative to an outcome's last price (as traded by anyone)
  tradingPositionsPerMarket: {
    // per-market rollup of trading positions
    [marketId: string]: MarketTradingPosition;
  };
  frozenFundsTotal: string; // User's total frozen funds. See docs on FrozenFunds. This total includes market validity bonds in addition to sum of frozen funds for all market outcomes in which user has a position.
  unrealizedRevenue24hChangePercent: string;
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
  static getAccountTimeRangedStatsParams = t.intersection([
    t.type({
      universe: t.string,
      account: t.string,
    }),
    t.partial({
      endTime: t.number,
      startTime: t.number,
    }),
  ]);

  static getUserTradingPositionsParams = t.intersection([
    userTradingPositionsParams,
    sortOptions,
  ]);
  static getProfitLossParams = getProfitLossParams;
  static getProfitLossSummaryParams = getProfitLossSummaryParams;

  @Getter('getAccountTimeRangedStatsParams')
  static async getAccountTimeRangedStats(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Users.getAccountTimeRangedStatsParams>
  ): Promise<AccountTimeRangedStatsResult> {
    // guards
    if (!(await augur.contracts.augur.isKnownUniverse_(params.universe))) {
      throw new Error('Unknown universe: ' + params.universe);
    }

    const startTime = params.startTime ? params.startTime : 0;
    const endTime = params.endTime
      ? params.endTime
      : await augur.contracts.augur.getTimestamp_();

    if (params.startTime > params.endTime) {
      throw new Error('startTime must be less than or equal to endTime');
    }

    const marketsRequest = {
      selector: {
        $and: [
          { marketCreator: params.account },
          { universe: params.universe },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } },
          { timestamp: { $lte: `0x${endTime.toString(16)}` } },
        ],
      },
    };

    const initialReporterRequest = {
      selector: {
        $and: [
          { reporter: params.account },
          { universe: params.universe },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } },
          { timestamp: { $lte: `0x${endTime.toString(16)}` } },
        ],
      },
    };

    const disputeCrowdourcerRequest = {
      selector: {
        $and: [
          { reporter: params.account },
          { universe: params.universe },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } },
          { timestamp: { $lte: `0x${endTime.toString(16)}` } },
        ],
      },
    };

    const profitLossChangedRequest = {
      selector: {
        $and: [
          { account: params.account },
          { netPosition: { $ne: 0 } },
          { universe: params.universe },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } },
          { timestamp: { $lte: `0x${endTime.toString(16)}` } },
        ],
      },
    };

    const orderFilledRequest = {
      selector: {
        $or: [{ orderCeator: params.account }, { orderFiller: params.account }],
        $and: [
          { universe: params.universe },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } },
          { timestamp: { $lte: `0x${endTime.toString(16)}` } },
        ],
      },
    };

    const compareArrays = (lhs: string[], rhs: string[]): number => {
      let equal = 1;

      lhs.forEach((item: string, index: number) => {
        if (index >= rhs.length || item !== rhs[index]) {
          equal = 0;
        }
      });

      return equal;
    };

    const marketsCreatedLog = await db.findMarketCreatedLogs(marketsRequest);

    const marketsCreated = marketsCreatedLog.length;
    const initialReporterReedeemedLogs = await db.findInitialReporterRedeemedLogs(
      initialReporterRequest
    );
    const disputeCrowdsourcerReedeemedLogs = await db.findDisputeCrowdsourcerRedeemedLogs(
      disputeCrowdourcerRequest
    );

    const successfulDisputes = _.sum(
      await Promise.all(
        ((disputeCrowdsourcerReedeemedLogs as any) as DisputeCrowdsourcerRedeemed[]).map(
          async (log: DisputeCrowdsourcerRedeemed) => {
            const marketFinalization = {
              selector: {
                $and: [
                  { market: log.market },
                  { universe: params.universe },
                  { timestamp: { $gte: `0x${startTime.toString(16)}` } },
                  { timestamp: { $lte: `0x${endTime.toString(16)}` } },
                ],
              },
            };

            const markets = ((await db.findMarketFinalizedLogs(
              marketFinalization
            )) as any) as MarketFinalized[];

            if (markets.length) {
              return compareArrays(
                markets[0].winningPayoutNumerators,
                log.payoutNumerators
              );
            } else {
              return 0;
            }
          }
        )
      )
    );

    const redeemedPositions =
      initialReporterReedeemedLogs.length + successfulDisputes;

    const orderFilledLogs = await db.findOrderFilledLogs(orderFilledRequest);
    const numberOfTrades = _.uniqWith(
      (orderFilledLogs as any) as OrderEvent[],
      (a: OrderEvent, b: OrderEvent) => {
        return a.tradeGroupId === b.tradeGroupId;
      }
    ).length;

    const marketsTraded = _.uniqWith(
      (orderFilledLogs as any) as OrderEvent[],
      (a: OrderEvent, b: OrderEvent) => {
        return a.market === b.market;
      }
    ).length;

    const profitLossChangedLogs = await db.findProfitLossChangedLogs(
      params.account,
      profitLossChangedRequest
    );
    const positions = _.uniqWith(
      (profitLossChangedLogs as any) as ProfitLossChanged[],
      (a: ProfitLossChanged, b: ProfitLossChanged) => {
        return a.market === b.market && a.outcome === b.outcome;
      }
    ).length;

    return {
      positions,
      numberOfTrades,
      marketsCreated,
      marketsTraded,
      successfulDisputes,
      redeemedPositions,
    };
  }

  @Getter('getUserTradingPositionsParams')
  static async getUserTradingPositions(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Users.getUserTradingPositionsParams>
  ): Promise<UserTradingPositions> {
    if (!params.universe && !params.marketId) {
      throw new Error(
        "'getUserTradingPositions' requires a 'universe' or 'marketId' param be provided"
      );
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

    const profitLossResultsByMarketAndOutcome = reduceMarketAndOutcomeDocsToOnlyLatest(
      await getProfitLossRecordsByMarketAndOutcome(db, params.account, request)
    );

    const orderFilledRequest = {
      selector: {
        universe: params.universe,
        market: params.marketId,
        $or: [
          { orderCreator: params.account },
          { orderFiller: params.account },
        ],
      },
    };

    const allOrderFilledRequest = {
      selector: {
        universe: params.universe,
        market: params.marketId
      },
    };

    const ordersFilledResultsByMarketAndOutcome = reduceMarketAndOutcomeDocsToOnlyLatest(
      await getOrderFilledRecordsByMarketAndOutcome(db, orderFilledRequest)
    );

    const allOrdersFilledResultsByMarketAndOutcome = reduceMarketAndOutcomeDocsToOnlyLatest(
      await getOrderFilledRecordsByMarketAndOutcome(db, allOrderFilledRequest)
    );

    const marketIds = _.keys(profitLossResultsByMarketAndOutcome);
    const marketsResponse = await db.findMarketCreatedLogs({
      selector: { market: { $in: marketIds } },
    });
    const markets = _.keyBy(marketsResponse, 'market');

    const marketFinalizedRequest = {
      selector: {
        universe: params.universe,
        market: { $in: marketIds },
      },
    };

    const marketFinalizedResults = await db.findMarketFinalizedLogs(
      marketFinalizedRequest
    );
    const marketFinalizedByMarket = _.keyBy(marketFinalizedResults, 'market');

    const shareTokenBalances = await db.findTokenBalanceChangedLogs(
      params.account,
      {
        selector: {
          universe: params.universe,
          owner: params.account,
          tokenType: 1, // ShareToken  TODO: Get from constants somewhere
        },
      }
    );
    const shareTokenBalancesByMarket = _.groupBy(shareTokenBalances, 'market');
    const shareTokenBalancesByMarketandOutcome = _.mapValues(
      shareTokenBalancesByMarket,
      marketShares => {
        return _.keyBy(marketShares, 'outcome');
      }
    );

    // map Latest PLs to Trading Positions
    const tradingPositionsByMarketAndOutcome = _.mapValues(
      profitLossResultsByMarketAndOutcome,
      profitLossResultsByOutcome => {
        return _.mapValues(
          profitLossResultsByOutcome,
          (profitLossResult: ProfitLossChangedLog) => {
            const marketDoc = markets[profitLossResult.market];
            if (
              !ordersFilledResultsByMarketAndOutcome[profitLossResult.market] ||
              !ordersFilledResultsByMarketAndOutcome[profitLossResult.market][
                profitLossResult.outcome
              ]
            ) {
              return null;
            }
            let outcomeValue = new BigNumber(
              allOrdersFilledResultsByMarketAndOutcome[profitLossResult.market][
                profitLossResult.outcome
              ]!.price
            );
            if (marketFinalizedByMarket[profitLossResult.market]) {
              outcomeValue = new BigNumber(
                marketFinalizedByMarket[
                  profitLossResult.market
                ].winningPayoutNumerators[
                  new BigNumber(profitLossResult.outcome).toNumber()
                ]
              );
            }
            const tradingPosition = getTradingPositionFromProfitLossFrame(
              profitLossResult,
              marketDoc,
              outcomeValue,
              new BigNumber(profitLossResult.timestamp).toNumber(),
              shareTokenBalancesByMarketandOutcome
            );

            return tradingPosition;
          }
        );
      }
    );

    // TODO add raw token balances that have no PL data for third party client integration to work ok.

    const tradingPositions = _.flatten(
      _.values(_.mapValues(tradingPositionsByMarketAndOutcome, _.values))
    ).filter(t => t !== null);

    const marketTradingPositions = _.mapValues(
      tradingPositionsByMarketAndOutcome,
      tradingPositionsByOutcome => {
        const tradingPositions = _.values(
          _.omitBy(tradingPositionsByOutcome, _.isNull)
        );
        return sumTradingPositions(tradingPositions);
      }
    );

    // tradingPositions filters out users create open orders, need to use `profitLossResultsByMarketAndOutcome` to calc total fronzen funds
    const allProfitLossResults = _.flatten(
      _.values(_.mapValues(profitLossResultsByMarketAndOutcome, _.values))
    );
    const frozenFundsTotal = _.reduce(
      allProfitLossResults,
      (value, tradingPosition) => {
        return value.plus(tradingPosition.frozenFunds);
      },
      new BigNumber(0)
    );
    // TODO add market validity bond to total. Need to send a log for this since it is variable over time.

    const universe = params.universe
      ? params.universe
      : await augur.getMarket(params.marketId).getUniverse_();
    const profitLossSummary = await Users.getProfitLossSummary(augur, db, {
      universe,
      account: params.account,
    });

    return {
      tradingPositions,
      tradingPositionsPerMarket: marketTradingPositions,
      frozenFundsTotal: frozenFundsTotal.dividedBy(QUINTILLION).toFixed(),
      unrealizedRevenue24hChangePercent: profitLossSummary[1].unrealizedPercent,
    };
  }

  @Getter('getProfitLossParams')
  static async getProfitLoss(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Users.getProfitLossParams>
  ): Promise<MarketTradingPosition[]> {
    if (!params.startTime) {
      throw new Error(
        "'getProfitLoss' requires a 'startTime' param be provided"
      );
    }
    const now = await augur.contracts.augur.getTimestamp_();
    const startTime = params.startTime!;
    const endTime = params.endTime || now.toNumber();
    const periodInterval =
      params.periodInterval === undefined
        ? Math.ceil((endTime - startTime) / DEFAULT_NUMBER_OF_BUCKETS)
        : params.periodInterval;

    const profitLossRequest = {
      selector: {
        $and: [
          { universe: params.universe },
          { account: params.account },
          { timestamp: { $lte: `0x${endTime.toString(16)}` } },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } },
        ],
      },
    };
    const profitLossByMarketAndOutcome = await getProfitLossRecordsByMarketAndOutcome(
      db,
      params.account!,
      profitLossRequest
    );

    const orderFilledRequest = {
      selector: {
        $or: [
          { orderCreator: params.account },
          { orderFiller: params.account },
        ],
        $and: [
          { universe: params.universe },
          { timestamp: { $lte: `0x${endTime.toString(16)}` } },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } },
        ],
      },
    };
    const ordersFilledResultsByMarketAndOutcome = await getOrderFilledRecordsByMarketAndOutcome(
      db,
      orderFilledRequest
    );

    const marketIds = _.keys(profitLossByMarketAndOutcome);

    const marketFinalizedRequest = {
      selector: {
        $and: [
          { universe: params.universe },
          { market: { $in: marketIds } },
          { timestamp: { $lte: `0x${endTime.toString(16)}` } },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } },
        ],
      },
    };

    const marketFinalizedResults = await db.findMarketFinalizedLogs(
      marketFinalizedRequest
    );
    const marketFinalizedByMarket = _.keyBy(marketFinalizedResults, 'market');

    const marketsResponse = await db.findMarketCreatedLogs({
      selector: { market: { $in: marketIds } },
    });
    const markets = _.keyBy(marketsResponse, 'market');

    const buckets = bucketRangeByInterval(startTime, endTime, periodInterval);

    return _.map(buckets, bucketTimestamp => {
      const tradingPositionsByMarketAndOutcome = _.mapValues(
        profitLossByMarketAndOutcome,
        (profitLossByOutcome, marketId) => {
          const marketDoc = markets[marketId];
          return _.mapValues(
            profitLossByOutcome,
            (outcomePLValues, outcome) => {
              const latestOutcomePLValue = getLastDocBeforeTimestamp<
                ProfitLossChangedLog
              >(outcomePLValues, bucketTimestamp);
              const outcomeValues =
              ordersFilledResultsByMarketAndOutcome[marketId][outcome];
              if (!latestOutcomePLValue || !outcomeValues) {
                return {
                  timestamp: bucketTimestamp,
                  frozenFunds: '0',
                  marketId: '',
                  realized: '0',
                  unrealized: '0',
                  total: '0',
                  unrealizedCost: '0',
                  realizedCost: '0',
                  totalCost: '0',
                  realizedPercent: '0',
                  unrealizedPercent: '0',
                  totalPercent: '0',
                  currentValue: '0',
                };
              }
              let outcomeValue = new BigNumber(
                getLastDocBeforeTimestamp<ParsedOrderEventLog>(
                  outcomeValues,
                  bucketTimestamp
                )!.price
              );
              if (
                marketFinalizedByMarket[marketId] &&
                bucketTimestamp.lte(marketFinalizedByMarket[marketId].timestamp)
              ) {
                outcomeValue = new BigNumber(
                  marketFinalizedByMarket[marketId].winningPayoutNumerators[
                    new BigNumber(outcome).toNumber()
                  ]
                );
              }
              return getTradingPositionFromProfitLossFrame(
                latestOutcomePLValue,
                marketDoc,
                outcomeValue,
                bucketTimestamp.toNumber(),
                null
              );
            }
          );
        }
      );

      const tradingPositions: MarketTradingPosition[] = _.flattenDeep(
        _.map(_.values(tradingPositionsByMarketAndOutcome), _.values)
      );
      return sumTradingPositions(tradingPositions);
    });
  }

  @Getter('getProfitLossSummaryParams')
  static async getProfitLossSummary(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Users.getProfitLossSummaryParams>
  ): Promise<NumericDictionary<MarketTradingPosition>> {
    const result: NumericDictionary<MarketTradingPosition> = {};
    const now = await augur.contracts.augur.getTimestamp_();
    const endTime = params.endTime || now.toNumber();
    for (const days of [1, 30]) {
      const periodInterval = days * 60 * 60 * 24;
      const startTime = endTime - periodInterval;

      const [startProfit, endProfit, ...rest] = await Users.getProfitLoss(
        augur,
        db,
        {
          universe: params.universe,
          account: params.account,
          startTime,
          endTime,
          periodInterval,
        }
      );

      if (rest.length !== 0) {
        throw new Error(
          'PL calculation in summary returning more thant two bucket'
        );
      }

      const negativeStartProfit: MarketTradingPosition = {
        timestamp: startProfit.timestamp,
        realized: new BigNumber(startProfit.realized).negated().toFixed(),
        unrealized: new BigNumber(startProfit.unrealized).negated().toFixed(),
        frozenFunds: '0',
        marketId: '',
        total: '0',
        unrealizedCost: '0',
        realizedCost: '0',
        totalCost: '0',
        realizedPercent: '0',
        unrealizedPercent: '0',
        totalPercent: '0',
        currentValue: '0',
      };

      result[days] = sumTradingPositions([endProfit, negativeStartProfit]);
    }

    return result;
  }
}

export function sumTradingPositions(
  tradingPositions: MarketTradingPosition[]
): MarketTradingPosition {
  const summedTrade = _.reduce(
    tradingPositions,
    (resultPosition, tradingPosition) => {
      const frozenFunds = new BigNumber(resultPosition.frozenFunds).plus(
        tradingPosition.frozenFunds
      );
      const realized = new BigNumber(resultPosition.realized).plus(
        tradingPosition.realized
      );
      const unrealized = new BigNumber(resultPosition.unrealized).plus(
        tradingPosition.unrealized
      );
      const realizedCost = new BigNumber(resultPosition.realizedCost).plus(
        tradingPosition.realizedCost
      );
      const unrealizedCost = new BigNumber(resultPosition.unrealizedCost).plus(
        tradingPosition.unrealizedCost
      );

      return {
        timestamp: tradingPosition.timestamp,
        frozenFunds: frozenFunds.toFixed(),
        marketId: tradingPosition.marketId,
        realized: realized.toFixed(),
        unrealized: unrealized.toFixed(),
        total: '0',
        unrealizedCost: unrealizedCost.toFixed(),
        realizedCost: realizedCost.toFixed(),
        totalCost: '0',
        realizedPercent: '0',
        unrealizedPercent: '0',
        totalPercent: '0',
        currentValue: '0',
      };
    },
    {
      timestamp: 0,
      frozenFunds: '0',
      marketId: '',
      realized: '0',
      unrealized: '0',
      total: '0',
      unrealizedCost: '0',
      realizedCost: '0',
      totalCost: '0',
      realizedPercent: '0',
      unrealizedPercent: '0',
      totalPercent: '0',
      currentValue: '0',
    } as MarketTradingPosition
  );

  const frozenFunds = new BigNumber(summedTrade.frozenFunds);
  const realized = new BigNumber(summedTrade.realized);
  const unrealized = new BigNumber(summedTrade.unrealized);
  const realizedCost = new BigNumber(summedTrade.realizedCost);
  const unrealizedCost = new BigNumber(summedTrade.unrealizedCost);

  const total = realized.plus(unrealized);
  const totalCost = realizedCost.plus(unrealizedCost);

  summedTrade.frozenFunds = frozenFunds.toFixed();
  summedTrade.total = total.toFixed();
  summedTrade.totalCost = totalCost.toFixed();
  summedTrade.realizedPercent = realizedCost.isZero()
    ? '0'
    : realized.dividedBy(realizedCost).toFixed();
  summedTrade.unrealizedPercent = unrealizedCost.isZero()
    ? '0'
    : unrealized.dividedBy(unrealizedCost).toFixed();
  summedTrade.totalPercent = totalCost.isZero()
    ? '0'
    : total.dividedBy(totalCost).toFixed();
  summedTrade.currentValue = unrealized.toFixed();

  return summedTrade;
}

function bucketRangeByInterval(
  startTime: number,
  endTime: number,
  periodInterval: number | null
): BigNumber[] {
  if (startTime < 0) {
    throw new Error('startTime must be a valid unix timestamp, greater than 0');
  }
  if (endTime < 0) {
    throw new Error('endTime must be a valid unix timestamp, greater than 0');
  }
  if (endTime < startTime) {
    throw new Error('endTime must be greater than or equal startTime');
  }
  if (periodInterval !== null && periodInterval <= 0) {
    throw new Error('periodInterval must be positive integer (seconds)');
  }

  const interval =
    periodInterval == null
      ? Math.ceil((endTime - startTime) / DEFAULT_NUMBER_OF_BUCKETS)
      : periodInterval;

  const buckets: BigNumber[] = [];
  for (
    let bucketEndTime = startTime;
    bucketEndTime < endTime;
    bucketEndTime += interval
  ) {
    buckets.push(new BigNumber(bucketEndTime));
  }
  buckets.push(new BigNumber(endTime));

  return buckets;
}

async function getProfitLossRecordsByMarketAndOutcome(
  db: DB,
  account: string,
  request: PouchDB.Find.FindRequest<{}>
): Promise<_.Dictionary<_.Dictionary<ProfitLossChangedLog[]>>> {
  const profitLossResult = await db.findProfitLossChangedLogs(account, request);
  return groupDocumentsByMarketAndOutcome<ProfitLossChangedLog>(
    profitLossResult
  );
}

async function getOrderFilledRecordsByMarketAndOutcome(
  db: DB,
  request: PouchDB.Find.FindRequest<{}>
): Promise<_.Dictionary<_.Dictionary<ParsedOrderEventLog[]>>> {
  const orderFilled = await db.findOrderFilledLogs(request);
  return groupDocumentsByMarketAndOutcome<ParsedOrderEventLog>(
    orderFilled,
    'outcome'
  );
}

function groupDocumentsByMarketAndOutcome<TDoc extends Doc>(
  docs: TDoc[],
  outcomeField = 'outcome'
): _.Dictionary<_.Dictionary<TDoc[]>> {
  const byMarket = _.groupBy(docs, 'market');
  return _.mapValues(byMarket, marketResult => {
    const outcomeResultsInMarket = _.groupBy(marketResult, outcomeField);
    return _.mapValues(outcomeResultsInMarket, outcomeResults => {
      return _.sortBy(outcomeResults, '_id');
    });
  });
}

function reduceMarketAndOutcomeDocsToOnlyLatest<TDoc extends Doc>(
  docs: _.Dictionary<_.Dictionary<TDoc[]>>
): _.Dictionary<_.Dictionary<TDoc>> {
  return _.mapValues(docs, marketResults => {
    return _.mapValues(marketResults, outcomeResults => {
      return _.reduce(
        outcomeResults,
        (latestResult: TDoc, outcomeResult) => {
          if (
            !latestResult ||
            new BigNumber(latestResult._id).lt(new BigNumber(outcomeResult._id))
          ) {
            return outcomeResult;
          }
          return latestResult;
        },
        outcomeResults[0]
      );
    });
  });
}

function getLastDocBeforeTimestamp<TDoc extends Timestamped>(
  docs: TDoc[],
  timestamp: BigNumber
): TDoc | undefined {
  const allBeforeTimestamp = _.takeWhile(docs, doc =>
    timestamp.gte(doc.timestamp, 16)
  );
  if (allBeforeTimestamp.length > 0) {
    return _.last(allBeforeTimestamp);
  }
  return undefined;
}

function getTradingPositionFromProfitLossFrame(
  profitLossFrame: ProfitLossChangedLog,
  marketDoc: MarketCreatedLog,
  onChainOutcomeValue: BigNumber,
  timestamp: number,
  shareTokenBalancesByMarketandOutcome
): TradingPosition {
  const minPrice = new BigNumber(marketDoc.prices[0]);
  const maxPrice = new BigNumber(marketDoc.prices[1]);
  const numTicks = new BigNumber(marketDoc.numTicks);
  const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);

  const onChainFrozenFunds = new BigNumber(profitLossFrame.frozenFunds);
  const onChainNetPosition = new BigNumber(profitLossFrame.netPosition);
  const onChainAvgPrice = new BigNumber(profitLossFrame.avgPrice);
  const onChainRealizedProfit = new BigNumber(profitLossFrame.realizedProfit);
  const onChainRealizedCost = new BigNumber(profitLossFrame.realizedCost);
  let onChainRawPosition = new BigNumber(0);
  if (
    shareTokenBalancesByMarketandOutcome &&
    shareTokenBalancesByMarketandOutcome[marketDoc.market] &&
    shareTokenBalancesByMarketandOutcome[marketDoc.market][
      profitLossFrame.outcome
    ]
  ) {
    onChainRawPosition = new BigNumber(
      shareTokenBalancesByMarketandOutcome[marketDoc.market][
        profitLossFrame.outcome
      ].balance
    );
  }
  const onChainAvgCost = onChainNetPosition.isNegative()
    ? numTicks.minus(onChainAvgPrice)
    : onChainAvgPrice;
  const onChainUnrealizedCost = onChainNetPosition
    .abs()
    .multipliedBy(onChainAvgCost);

  const frozenFunds = onChainFrozenFunds.dividedBy(10 ** 18);
  const netPosition: BigNumber = convertOnChainAmountToDisplayAmount(
    onChainNetPosition,
    tickSize
  );
  const rawPosition: BigNumber = convertOnChainAmountToDisplayAmount(
    onChainRawPosition,
    tickSize
  );
  const realizedProfit = onChainRealizedProfit.dividedBy(10 ** 18);
  const avgPrice: BigNumber = convertOnChainPriceToDisplayPrice(
    onChainAvgPrice,
    minPrice,
    tickSize
  );
  const realizedCost = onChainRealizedCost.dividedBy(10 ** 18);
  const unrealizedCost = onChainUnrealizedCost.dividedBy(10 ** 18);

  const lastTradePrice: BigNumber = convertOnChainPriceToDisplayPrice(
    onChainOutcomeValue,
    minPrice,
    tickSize
  );

  const unrealized = netPosition
    .abs()
    .multipliedBy(
      onChainNetPosition.isNegative()
        ? avgPrice.minus(lastTradePrice)
        : lastTradePrice.minus(avgPrice)
    );
  const shortPrice = (maxPrice.dividedBy(10 ** 18)).minus(lastTradePrice);
  const currentValue = netPosition.abs().multipliedBy(
    onChainNetPosition.isNegative() ? shortPrice : lastTradePrice);
  const realizedPercent = realizedCost.isZero()
    ? new BigNumber(0)
    : realizedProfit.dividedBy(realizedCost);
  const unrealizedPercent = unrealized.dividedBy(unrealizedCost);
  const totalPercent = realizedProfit
    .plus(unrealized)
    .dividedBy(realizedCost.plus(unrealizedCost));

  return {
    timestamp,
    frozenFunds: frozenFunds.toFixed(),
    marketId: profitLossFrame.market,
    outcome: new BigNumber(profitLossFrame.outcome).toNumber(),
    netPosition: netPosition.toFixed(),
    rawPosition: rawPosition.toFixed(),
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
    currentValue: currentValue.toFixed(),
  } as TradingPosition;
}

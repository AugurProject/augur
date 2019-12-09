import { BigNumber } from 'bignumber.js';
import { DB } from '../db/DB';
import { Getter } from './Router';
import { NumericDictionary } from 'lodash';
import Dexie from 'dexie';
import {
  ProfitLossChangedLog,
  ParsedOrderEventLog,
  Timestamped,
  MarketData,
  OrderState,
  Log,
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
import { MarketReportingState, OrderEventType } from '../../constants';

import * as _ from 'lodash';
import * as t from 'io-ts';
import { QUINTILLION } from '../../utils';
import { OnChainTrading, MarketTradingHistory, Orders } from './OnChainTrading';
import { MarketInfo, Markets } from './Markets';
import { Accounts, AccountReportingHistory } from './Accounts';

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

const getUserAccountParams = t.partial({
  universe: t.string,
  account: t.string,
});

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
  realized: string; // realized profit in tokens (eg. DAI) user already got from this market outcome. "realized" means the user bought/sold shares in such a way that the profit is already in the user's wallet
  unrealized: string; // unrealized profit in tokens (eg. DAI) user could get from this market outcome. "unrealized" means the profit isn't in the user's wallet yet; the user could close the position to "realize" the profit, but instead is holding onto the shares. Computed using last trade price.
  total: string; // total profit in tokens (eg. DAI). Always equal to realized + unrealized
  unrealizedCost: string; // denominated in tokens. Cost of shares in netPosition
  realizedCost: string; // denominated in tokens. Cumulative cost of shares included in realized profit
  totalCost: string; // denominated in tokens. Always equal to unrealizedCost + realizedCost
  realizedPercent: string; // realized profit percent (ie. profit/cost)
  unrealizedPercent: string; // unrealized profit percent (ie. profit/cost)
  totalPercent: string; // total profit percent (ie. profit/cost)
  currentValue: string; // current value of netPosition, always equal to unrealized minus frozenFunds
  unclaimedProceeds?: string; // Unclaimed trading proceeds after market creator fee & reporting fee have been subtracted
  unclaimedProfit?: string; // unclaimedProceeds - unrealizedCost
  userSharesBalances: { // outcomes that have a share balance
    [outcome: string]: string;
  }
}

export interface TradingPosition {
  timestamp: number;
  frozenFunds: string;
  marketId: string;
  outcome: number; // user's position is in this market outcome
  netPosition: string; // current quantity of shares in user's position for this market outcome. "net" position because if user bought 4 shares and sold 6 shares, netPosition would be -2 shares (ie. 4 - 6 = -2). User is "long" this market outcome (gets paid if this outcome occurs) if netPosition is positive. User is "short" this market outcome (gets paid if this outcome does not occur) if netPosition is negative
  rawPosition: string; // non synthetic, actual shares on outcome
  averagePrice: string; // denominated in tokens/share. average price user paid for shares in the current open position
  realized: string; // realized profit in tokens (eg. DAI) user already got from this market outcome. "realized" means the user bought/sold shares in such a way that the profit is already in the user's wallet
  unrealized: string; // unrealized profit in tokens (eg. DAI) user could get from this market outcome. "unrealized" means the profit isn't in the user's wallet yet; the user could close the position to "realize" the profit, but instead is holding onto the shares. Computed using last trade price.
  total: string; // total profit in tokens (eg. DAI). Always equal to realized + unrealized
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

export interface UserPositionTotals {
  totalFrozenFunds: string,
  tradingPositionsTotal: {
    unrealizedRevenue24hChangePercent: string
  }
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

export interface UserAccountDataResult {
  userTradeHistory: MarketTradingHistory;
  marketTradeHistory: MarketTradingHistory;
  userOpenOrders: Orders;
  userStakedRep: AccountReportingHistory;
  userPositions: UserTradingPositions;
  userPositionTotals: UserPositionTotals;
  marketsInfo: MarketInfo[];
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
  static getUserAccountParams = getUserAccountParams;

  @Getter('getUserAccountParams')
  static async getUserAccountData(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Users.getUserAccountParams>
  ): Promise<UserAccountDataResult> {
    if (!params.universe || !params.account) {
      throw new Error(
        "'getUserAccountData' requires a 'universe' and 'account' param be provided"
      );
    }

    let userPositionTotals = null;
    let marketTradeHistory = null;
    let marketsInfo = null;
    let marketList = null;
    let userTradeHistory = null;
    let userOpenOrders = null;
    let userPositions: UserTradingPositions = null;
    let userStakedRep: AccountReportingHistory = null;
    try {
      userTradeHistory = await OnChainTrading.getTradingHistory(augur, db, {
        account: params.account,
        universe: params.universe,
        filterFinalized: true
      });

      const uniqMarketIds = Object.keys(userTradeHistory);

      if (uniqMarketIds.length > 0) {
        marketTradeHistory = await OnChainTrading.getTradingHistory(augur, db, { marketIds: uniqMarketIds });
      }

      userOpenOrders = await OnChainTrading.getOrders(augur, db, {
        account: params.account,
        universe: params.universe,
        orderState: OrderState.OPEN,
      });

      marketList = await Markets.getMarkets(augur, db, {
        creator: params.account,
        universe: params.universe,
      });

      // user created markets are included, REP staked as no-show bond
      userStakedRep = await Accounts.getAccountRepStakeSummary(augur, db, {
        account: params.account,
        universe: params.universe,
      })

      const stakedRepMarketIds = [];
      if (userStakedRep.reporting && userStakedRep.reporting.contracts.length > 0)
      userStakedRep.reporting.contracts.map(c => [...stakedRepMarketIds, c.marketId]);
      if (userStakedRep.disputing && userStakedRep.disputing.contracts.length > 0)
      userStakedRep.disputing.contracts.map(c => [...stakedRepMarketIds, c.marketId]);


      const positions = await Users.getProfitLossSummary(augur, db, {
        account: params.account,
        universe: params.universe,
      })

      if (positions && Object.keys(positions).length > 0) {
        userPositionTotals = {
          totalFrozenFunds: positions[30].frozenFunds,
          totalRealizedPL: positions[30].realized,
          tradingPositionsTotal: {
            unrealizedRevenue24hChangePercent: positions[1].unrealizedPercent,
          },
        };
      }

      userPositions = await Users.getUserTradingPositions(augur, db, {
        account: params.account,
        universe: params.universe,
      })

      const userPositionsMarketIds: string[] = Array.from(
        new Set([
          ...userPositions.tradingPositions.reduce(
            (p, position) => [...p, position.marketId],
            []
          ),
        ])
      );

      const userOpenOrdersMarketIds = Object.keys(userOpenOrders);
      const marketIds: string[] = Array.from(
        new Set(
          ...uniqMarketIds,
          ...userOpenOrdersMarketIds,
          ...stakedRepMarketIds,
          ...userPositionsMarketIds,
        )
      );
      marketsInfo = await Markets.getMarketsInfo(augur, db, { marketIds });

    } catch(e) {
      console.error(e);
    }
    return {
      userTradeHistory,
      marketTradeHistory,
      userOpenOrders,
      userStakedRep,
      userPositions,
      userPositionTotals,
      marketsInfo: [...marketList.markets, ...marketsInfo]
    };
  }

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

    const universe = params.universe;
    const formattedStartTime = `0x${startTime.toString(16)}`;
    const formattedEndTime = `0x${endTime.toString(16)}`;

    const compareArrays = (lhs: string[], rhs: string[]): number => {
      let equal = 1;

      lhs.forEach((item: string, index: number) => {
        if (index >= rhs.length || item !== rhs[index]) {
          equal = 0;
        }
      });

      return equal;
    };

    const marketsCreatedLog = await db.MarketCreated.where('[universe+timestamp]').between([universe, formattedStartTime], [universe, formattedEndTime], true, true).and((log) => {
      return log.marketCreator === params.account;
    }).toArray();

    const marketsCreated = marketsCreatedLog.length;

    const initialReporterReedeemedLogs = await db.InitialReporterRedeemed.where("timestamp").between(formattedStartTime, formattedEndTime, true, true).and((log) => {
      return log.reporter === params.account && log.universe === params.universe;
    }).toArray();

    const disputeCrowdsourcerReedeemedLogs = await db.DisputeCrowdsourcerRedeemed.where("reporter").equals(params.account).and((log) => {
      if (log.universe !== params.universe) return false;
      if (log.timestamp < `0x${startTime.toString(16)}`) return false;
      if (log.timestamp > `0x${endTime.toString(16)}`) return false;
      return true;
    }).toArray();

    const successfulDisputes = _.sum(
      await Promise.all(
        ((disputeCrowdsourcerReedeemedLogs as any) as DisputeCrowdsourcerRedeemed[]).map(
          async (log: DisputeCrowdsourcerRedeemed) => {
            // TODO: If this is a slowdown this could be a single query outside of the loop
            const market = await db.Markets.get(log.market);

            if (market.finalized) {
              return compareArrays(
                market.winningPayoutNumerators,
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

    const orderFilledLogs = await db.OrderEvent.where('[universe+eventType+timestamp]').between([
      params.universe,
      OrderEventType.Fill,
      `0x${startTime.toString(16)}`
    ], [
      params.universe,
      OrderEventType.Fill,
      `0x${endTime.toString(16)}`
    ], true, true).and((log) => {
      return log.orderCreator === params.account || log.orderFiller === params.account;
    }).toArray();
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

    const profitLossChangedLogs = await db.ProfitLossChanged.where('[universe+account+timestamp]').between([
      params.universe,
      params.account,
      `0x${startTime.toString(16)}`
    ], [
      params.universe,
      params.account,
      `0x${endTime.toString(16)}`
    ], true, true).and((log) => {
      return log.netPosition !== '0x00';
    }).toArray();
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
    let tradingPositions = null;
    let marketTradingPositions = null;
    let frozenFundsTotal = null;
    let profitLossSummary = null;
  try {
    let profitLossCollection = await db.ProfitLossChanged.where('account').equals(params.account);
    if (params.limit) profitLossCollection = profitLossCollection.limit(params.limit);
    if (params.offset) profitLossCollection = profitLossCollection.offset(params.offset);
    const profitLossRecords = await profitLossCollection.and((log) => {
      if (params.universe && log.universe !== params.universe) return false;
      if (params.marketId && log.market !== params.marketId) return false;
      return true;
    }).toArray();
    const profitLossResultsByMarketAndOutcome = reduceMarketAndOutcomeDocsToOnlyLatest(
      await getProfitLossRecordsByMarketAndOutcome(db, params.account, profitLossRecords)
    );

    let allOrders: ParsedOrderEventLog[];
    if (params.marketId) {
      allOrders = await db.OrderEvent.where('[market+eventType]').equals([params.marketId, OrderEventType.Fill]).toArray();
    } else {
      allOrders = await db.OrderEvent.where('eventType').equals(OrderEventType.Fill).toArray();
    }
    const allOrdersFilledResultsByMarketAndOutcome = reduceMarketAndOutcomeDocsToOnlyLatest(
      await getOrderFilledRecordsByMarketAndOutcome(db, allOrders)
    );

    const orders = _.filter(allOrders, (log) => {
      return log.orderCreator === params.account || log.orderFiller === params.account;
    });
    const ordersFilledResultsByMarketAndOutcome = reduceMarketAndOutcomeDocsToOnlyLatest(
      await getOrderFilledRecordsByMarketAndOutcome(db, orders)
    );

    const marketIds = _.keys(profitLossResultsByMarketAndOutcome);

    const marketsData = await db.Markets.where("market").anyOf(marketIds).toArray();
    const markets = _.keyBy(marketsData, 'market');

    const marketFinalizedResults = await db.MarketFinalized.where("market").anyOf(marketIds).toArray();
    const marketFinalizedByMarket = _.keyBy(marketFinalizedResults, 'market');

    const shareTokenBalances = await db.ShareTokenBalanceChanged.where('[universe+account]').equals([params.universe, params.account]).toArray();
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

    tradingPositions = _.flatten(
      _.values(_.mapValues(tradingPositionsByMarketAndOutcome, _.values))
    ).filter(t => t !== null);

    marketTradingPositions = _.mapValues(
      tradingPositionsByMarketAndOutcome,
      tradingPositionsByOutcome => {
        const tradingPositions = _.values(
          _.omitBy(tradingPositionsByOutcome, _.isNull)
        );
        return sumTradingPositions(tradingPositions);
      }
    );
    // Create mapping for market/outcome balances
    const tokenBalanceChangedLogs = await db.ShareTokenBalanceChanged.where("[account+market+outcome]").between([
      params.account,
      Dexie.minKey
    ],[
      params.account,
      Dexie.maxKey
    ], true, true).and((log) => {
      return marketIds.includes(log.market);
    }).toArray();

    const marketOutcomeBalances = {};
    for (const tokenBalanceChangedLog of tokenBalanceChangedLogs) {
      if (!marketOutcomeBalances[tokenBalanceChangedLog.market]) {
        marketOutcomeBalances[tokenBalanceChangedLog.market] = {};
      }
      marketOutcomeBalances[tokenBalanceChangedLog.market][new BigNumber(tokenBalanceChangedLog.outcome).toNumber()] = tokenBalanceChangedLog.balance;
    }
    // Set unclaimedProceeds & unclaimedProfit
    for (const marketData of marketsData) {
      marketTradingPositions[marketData.market].unclaimedProceeds = '0';
      marketTradingPositions[marketData.market].unclaimedProfit = '0';
      if (marketData.reportingState === MarketReportingState.Finalized || MarketReportingState.AwaitingFinalization) {
        if (marketData.tentativeWinningPayoutNumerators) {
          for (const tentativeWinningPayoutNumerator in marketData.tentativeWinningPayoutNumerators) {
            if (marketOutcomeBalances[marketData.market] && marketData.tentativeWinningPayoutNumerators[tentativeWinningPayoutNumerator] !== '0x00' && marketOutcomeBalances[marketData.market][tentativeWinningPayoutNumerator]) {
              const numShares = new BigNumber(marketOutcomeBalances[marketData.market][tentativeWinningPayoutNumerator]);
              const reportingFeeDivisor = marketData.feeDivisor;
              const reportingFee = new BigNumber(tokenBalanceChangedLogs[0].balance).div(reportingFeeDivisor);
              const unclaimedProceeds = numShares.times(marketData.tentativeWinningPayoutNumerators[tentativeWinningPayoutNumerator])
                .minus(marketData.feePerCashInAttoCash)
                .minus(reportingFee);

              marketTradingPositions[marketData.market].unclaimedProceeds = new BigNumber(marketTradingPositions[marketData.market].unclaimedProceeds).plus(unclaimedProceeds).toString();
              marketTradingPositions[marketData.market].unclaimedProfit = new BigNumber(unclaimedProceeds).minus(new BigNumber(marketTradingPositions[marketData.market].unrealizedCost).times(QUINTILLION)).toString();
            }
          }
        }
      }
    }
    // Format unclaimedProceeds & unclaimedProfit to Dai with 2 decimal places
    for (const marketData of marketsData) {
      marketTradingPositions[marketData.market].unclaimedProceeds = new BigNumber(marketTradingPositions[marketData.market].unclaimedProceeds).dividedBy(QUINTILLION).toFixed(2);
      marketTradingPositions[marketData.market].unclaimedProfit = new BigNumber(marketTradingPositions[marketData.market].unclaimedProfit).dividedBy(QUINTILLION).toFixed(2);
      marketTradingPositions[
        marketData.market
      ].userSharesBalances = marketOutcomeBalances[marketData.market]
        ? Object.keys(marketOutcomeBalances[marketData.market]).reduce(
            (p, outcome) => {
              p[outcome] = convertOnChainAmountToDisplayAmount(
                new BigNumber(
                  marketOutcomeBalances[marketData.market][outcome]
                ),
                numTicksToTickSize(
                  new BigNumber(marketData.numTicks),
                  new BigNumber(marketData.prices[0]),
                  new BigNumber(marketData.prices[1])
                )
              );
              return p;
            },
            {}
          )
        : {};
    }

    // tradingPositions filters out users create open orders, need to use `profitLossResultsByMarketAndOutcome` to calc total frozen funds
    const allProfitLossResults = _.flatten(
      _.values(_.mapValues(profitLossResultsByMarketAndOutcome, _.values))
    );
    frozenFundsTotal = _.reduce(
      allProfitLossResults,
      (value, tradingPosition) => {
        return value.plus(tradingPosition.frozenFunds);
      },
      new BigNumber(0)
    );

    const ownedMarketsResponse = await db.Markets.where("marketCreator").equals(params.account).and((log) => !log.finalized).toArray();
    const ownedMarkets = _.map(ownedMarketsResponse, "market");
    const totalValidityBonds = await augur.contracts.hotLoading.getTotalValidityBonds_(ownedMarkets);
    frozenFundsTotal = frozenFundsTotal.plus(totalValidityBonds);

    const universe = params.universe
      ? params.universe
      : await augur.getMarket(params.marketId).getUniverse_();
    profitLossSummary = await Users.getProfitLossSummary(augur, db, {
      universe,
      account: params.account,
    });
  } catch(e) {
    console.error('getUserTradingPositions', e);
  }
    return {
      tradingPositions,
      tradingPositionsPerMarket: marketTradingPositions,
      frozenFundsTotal: frozenFundsTotal.dividedBy(QUINTILLION).toFixed(),
      unrealizedRevenue24hChangePercent: profitLossSummary && profitLossSummary[1].unrealizedPercent || "0",
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

    const profitLossOrders = await db.ProfitLossChanged.where('[universe+account+timestamp]').between([
      params.universe,
      params.account,
      `0x${startTime.toString(16)}`
    ], [
      params.universe,
      params.account,
      `0x${endTime.toString(16)}`
    ], true, true).toArray();
    const profitLossByMarketAndOutcome = await getProfitLossRecordsByMarketAndOutcome(
      db,
      params.account!,
      profitLossOrders
    );

    const orders = await db.OrderEvent.where('[universe+eventType+timestamp]').between([
      params.universe,
      OrderEventType.Fill,
      `0x${startTime.toString(16)}`
    ], [
      params.universe,
      OrderEventType.Fill,
      `0x${endTime.toString(16)}`
    ], true, true).and((log) => {
      return log.orderFiller === params.account || log.orderCreator === params.account;
    }).toArray();
    const ordersFilledResultsByMarketAndOutcome = await getOrderFilledRecordsByMarketAndOutcome(
      db,
      orders
    );

    const marketIds = _.keys(profitLossByMarketAndOutcome);

    const marketFinalizedResults = await db.MarketFinalized.where("market").anyOf(marketIds).and((log) => {
      return log.timestamp <= `0x${endTime.toString(16)}` && log.timestamp >= `0x${startTime.toString(16)}`;
    }).toArray();
    const marketFinalizedByMarket = _.keyBy(marketFinalizedResults, 'market');

    const marketsResponse = await db.Markets.where("market").anyOf(marketIds).toArray();
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
              let hasOutcomeValues = !!(
                ordersFilledResultsByMarketAndOutcome[marketId] &&
                ordersFilledResultsByMarketAndOutcome[marketId][outcome]
              );
              if (!latestOutcomePLValue || !hasOutcomeValues) {
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
              const outcomeValues = ordersFilledResultsByMarketAndOutcome[marketId][outcome];
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
    try {
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
          userSharesBalances: {}
        };

        result[days] = sumTradingPositions([endProfit, negativeStartProfit]);
      }
    } catch(e) {
      console.error(e);
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

      const currentValue = new BigNumber(resultPosition.currentValue).plus(
        tradingPosition.currentValue
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
        currentValue: currentValue.toFixed(),
        userSharesBalances: {}
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
      userSharesBalances: {}
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
    : realized.dividedBy(realizedCost).toFixed(4);
  summedTrade.unrealizedPercent = unrealizedCost.isZero()
    ? '0'
    : unrealized.dividedBy(unrealizedCost).toFixed();
  summedTrade.totalPercent = totalCost.isZero()
    ? '0'
    : total.dividedBy(totalCost).toFixed(4);

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
  profitLossResult: ProfitLossChangedLog[]
): Promise<_.Dictionary<_.Dictionary<ProfitLossChangedLog[]>>> {
  return groupDocumentsByMarketAndOutcome<ProfitLossChangedLog>(
    profitLossResult
  );
}

async function getOrderFilledRecordsByMarketAndOutcome(
  db: DB,
  orders: ParsedOrderEventLog[]
): Promise<_.Dictionary<_.Dictionary<ParsedOrderEventLog[]>>> {
  return groupDocumentsByMarketAndOutcome<ParsedOrderEventLog>(
    orders,
    'outcome'
  );
}

function groupDocumentsByMarketAndOutcome<TDoc extends Log>(
  docs: TDoc[],
  outcomeField = 'outcome'
): _.Dictionary<_.Dictionary<TDoc[]>> {
  const byMarket = _.groupBy(docs, 'market');
  return _.mapValues(byMarket, marketResult => {
    const outcomeResultsInMarket = _.groupBy(marketResult, outcomeField);
    return _.mapValues(outcomeResultsInMarket, outcomeResults => {
      return _.sortBy(outcomeResults, ['blockNumber', 'logIndex']);
    });
  });
}

function reduceMarketAndOutcomeDocsToOnlyLatest<TDoc extends Log>(
  docs: _.Dictionary<_.Dictionary<TDoc[]>>
): _.Dictionary<_.Dictionary<TDoc>> {
  return _.mapValues(docs, marketResults => {
    return _.mapValues(marketResults, outcomeResults => {
      return _.reduce(
        outcomeResults,
        (latestResult: TDoc, outcomeResult) => {
          if (
            !latestResult ||
            latestResult.blockNumber < outcomeResult.blockNumber ||
            latestResult.blockNumber === outcomeResult.blockNumber && latestResult.logIndex < outcomeResult.logIndex
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
  marketDoc: MarketData,
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

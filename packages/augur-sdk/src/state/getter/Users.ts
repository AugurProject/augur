import {
  INIT_REPORTING_FEE_DIVISOR,
  Log,
  LogTimestamp,
  MarketData,
  MarketInfo,
  MarketReportingState,
  MarketType,
  ORDER_TYPES,
  OrderEventType,
  ParsedOrderEventLog,
  ProfitLossChangedLog,
  ZeroXOrders,
  Order,
} from '@augurproject/sdk-lite';
import {
  DisputeCrowdsourcerRedeemed,
  OrderEvent,
  ProfitLossChanged,
} from '@augurproject/sdk-lite/build/events';
import { MarketTradingHistory } from '@augurproject/sdk-lite/build/onChainTrading';
import { BigNumber } from 'bignumber.js';
import Dexie from 'dexie';
import * as t from 'io-ts';
import * as _ from 'lodash';
import { NumericDictionary } from 'lodash';
import {
  Augur,
  convertAttoValueToDisplayValue,
  convertOnChainAmountToDisplayAmount,
  convertOnChainPriceToDisplayPrice,
  numTicksToTickSize,
} from '../../index';
import { QUINTILLION, ZERO } from '../../utils';
import { DB } from '../db/DB';
import { AccountReportingHistory, Accounts } from './Accounts';
import { Markets } from './Markets';
import {
  getMarkets,
  OnChainTrading,

} from './OnChainTrading';
import { Getter } from './Router';
import { sortOptions } from './types';
import { collapseZeroXOrders } from './ZeroXOrdersGetters';

const ONE_DAY = 1;
const DAYS_IN_MONTH = 30;
const DEFAULT_NUMBER_OF_BUCKETS = DAYS_IN_MONTH;

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
  ignoreAwaitingAndFinalizedMarkets: t.boolean,
});

const getProfitLossParams = t.intersection([
  getProfitLossSummaryParams,
  t.partial({
    startTime: t.number,
    periodInterval: t.number,
    outcome: t.number,
    ignoreAwaitingAndFinalizedMarkets: t.boolean,
  }),
]);

export interface UserOpenOrders {
  orders: ZeroXOrders;
  totalOpenOrdersFrozenFunds: string;
}

export interface FrozenFundsBreakdown {
  total: string,
  createdMarkets: {
    total: string;
    markets: {
      [marketId: string] : string;
    }
  },
  positions: {
    total: string;
    markets: {
      [marketId: string] : string;
    }
  },
  openOrders: {
    total: string;
    markets: {
      [marketId: string] : string;
    }
  }
}

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
  unrealized24Hr: string; // weighted average of all positions unrealized profit
  total: string; // total profit in tokens (eg. DAI). Always equal to realized + unrealized
  unrealizedCost: string; // denominated in tokens. Cost of shares in netPosition
  realizedCost: string; // denominated in tokens. Cumulative cost of shares included in realized profit
  totalCost: string; // denominated in tokens. Always equal to unrealizedCost + realizedCost
  realizedPercent: string; // realized profit percent (ie. profit/cost)
  unrealizedPercent: string; // unrealized profit percent (ie. profit/cost)
  unrealized24HrPercent: string; // unrealized profit percent (ie. 24Hr profit/cost)
  totalPercent: string; // total profit percent (ie. profit/cost)
  currentValue: string; // current value of netPosition, always equal to unrealized minus frozenFunds
  unclaimedProceeds?: string; // Unclaimed trading proceeds after market creator fee & reporting fee have been subtracted
  unclaimedProfit?: string; // unclaimedProceeds - unrealizedCost
  fee?: string;
  userSharesBalances: {
    // outcomes that have a share balance
    [outcome: string]: string;
  };
  fullLoss?: boolean;
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
  unrealized24Hr: string; // unrealized profit using past 24 hour outcome price for market, if market hasn't been traded in last 24 hours then this value will be zero
  total: string; // total profit in tokens (eg. DAI). Always equal to realized + unrealized
  unrealizedCost: string; // denominated in tokens. Cost of shares in netPosition
  realizedCost: string; // denominated in tokens. Cumulative cost of shares included in realized profit
  totalCost: string; // denominated in tokens. Always equal to unrealizedCost + realizedCost
  realizedPercent: string; // realized profit percent (ie. profit/cost)
  unrealizedPercent: string; // unrealized profit percent (ie. profit/cost)
  unrealized24HrPercent: string; // unrealized 24Hr profit percent (ie. 24Hr profit/cost)
  totalPercent: string; // total profit percent (ie. profit/cost)
  currentValue: string; // current value of netPosition, always equal to unrealized minus frozenFunds
  priorPosition?: {
    unrealizedCost: string;
    avgPrice: string;
    netPosition: string;
  };
}

export interface UserTradingPositions {
  tradingPositions: TradingPosition[]; // per-outcome TradingPosition, where unrealized profit is relative to an outcome's last price (as traded by anyone)
  tradingPositionsPerMarket: {
    // per-market rollup of trading positions
    [marketId: string]: MarketTradingPosition;
  };
  unrealizedRevenue24hChangePercent: string;
}

export interface UserPositionTotals {
  totalFrozenFunds: string;
  tradingPositionsTotal: {
    unrealizedRevenue24hChangePercent: string;
  };
}
export interface UserTotalOnChainFrozenFunds {
  totalFrozenFunds: string;
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

export interface UserAccountDataResult extends UserPositionsPlusResult {
  marketTradeHistory: MarketTradingHistory;
  userOpenOrders: UserOpenOrders;
  userStakedRep: AccountReportingHistory;
  marketsInfo: MarketInfo[];
}

export interface UserPositionsPlusResult {
  userTradeHistory: MarketTradingHistory;
  userPositions: UserTradingPositions;
  userRawPositions: UserTradingPositions;
  userPositionTotals: UserPositionTotals;
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
  static getUserFrozenFundsBreakdownParams = getUserAccountParams;
  static getTotalOnChainFrozenFundsParams = getUserAccountParams;
  static getUserPositionsPlusParams = getUserAccountParams;

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
    let drMarketList = null;
    let userTradeHistory = null;
    let userOpenOrders: UserOpenOrders = null;
    let userPositions: UserTradingPositions = null;
    let userRawPositions: UserTradingPositions = null;
    let userStakedRep: AccountReportingHistory = null;

    marketList = await Markets.getMarkets(augur, db, {
      creator: params.account,
      universe: params.universe,
    });

    userTradeHistory = await OnChainTrading.getTradingHistory(augur, db, {
      account: params.account,
      universe: params.universe,
    });

    const userCreateMarketIds = _.map(marketList.markets, 'id');
    const uniqMarketIds = Object.keys(userTradeHistory).concat(
      userCreateMarketIds
    );

    if (uniqMarketIds.length > 0) {
      marketTradeHistory = await OnChainTrading.getTradingHistory(augur, db, {
        marketIds: uniqMarketIds,
      });
    }

    userPositions = await Users.getUserTradingPositions(augur, db, {
      account: params.account,
      universe: params.universe,
    });

    userRawPositions = await Users.getRawUserTradingPositions(augur, db, {
      account: params.account,
      universe: params.universe,
    });

    userOpenOrders = await Users.getUserOpenOrders(augur, db, {
      account: params.account,
      universe: params.universe,
    });

    drMarketList = await Markets.getMarkets(augur, db, {
      designatedReporter: params.account,
      universe: params.universe,
    });

    // user created markets are included, REP staked as no-show bond
    userStakedRep = await Accounts.getAccountRepStakeSummary(augur, db, {
      account: params.account,
      universe: params.universe,
    });

    let stakedRepMarketIds = [];
    if (userStakedRep.reporting && userStakedRep.reporting.contracts.length > 0)
      stakedRepMarketIds = userStakedRep.reporting.contracts.map(
        c => c.marketId
      );
    if (userStakedRep.disputing && userStakedRep.disputing.contracts.length > 0)
      stakedRepMarketIds = stakedRepMarketIds.concat(
        userStakedRep.disputing.contracts.map(c => c.marketId)
      );

    const profitLoss = await Users.getProfitLossSummary(augur, db, {
      account: params.account,
      universe: params.universe,
      ignoreAwaitingAndFinalizedMarkets: true,
    });

    const funds = await Users.getTotalOnChainFrozenFunds(augur, db, {
      account: params.account,
      universe: params.universe,
    });
    if (profitLoss && Object.keys(profitLoss).length > 0) {
      userPositionTotals = {
        totalFrozenFunds: funds.totalFrozenFunds,
        totalRealizedPL: profitLoss[DAYS_IN_MONTH].realized,
        tradingPositionsTotal: {
          unrealizedRevenue24hChangePercent:
            profitLoss[ONE_DAY].unrealizedPercent,
        },
      };
    }

    const userPositionsMarketIds: string[] = Array.from(
      new Set([
        ...userPositions.tradingPositions.reduce(
          (p, position) => [...p, position.marketId],
          []
        ),
      ])
    );
    const userOpenOrdersMarketIds = Object.keys(userOpenOrders.orders);
    if (userOpenOrdersMarketIds.length === 0)
      console.log('User has no open orders');
    const warpSyncMarket = await augur.getWarpSyncMarket(params.universe);

    const set = new Set(
      uniqMarketIds
        .concat(userOpenOrdersMarketIds)
        .concat(stakedRepMarketIds)
        .concat(userPositionsMarketIds)
        .concat(warpSyncMarket.address)
    );

    var marketIds: string[] = Array.from(set);

    marketsInfo = await Markets.getMarketsInfo(augur, db, { marketIds });

    return {
      userTradeHistory,
      marketTradeHistory,
      userOpenOrders,
      userStakedRep,
      userPositions,
      userRawPositions,
      userPositionTotals,
      marketsInfo: [
        ...(marketList || {}).markets,
        ...marketsInfo,
        ...(drMarketList || {}).markets,
      ],
    };
  }

  @Getter('getUserPositionsPlusParams')
  static async getUserPositionsPlus(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Users.getUserAccountParams>
  ): Promise<UserPositionsPlusResult> {
    if (!params.universe || !params.account) {
      throw new Error(
        "'getUserAccountData' requires a 'universe' and 'account' param be provided"
      );
    }

    let userPositionTotals = null;

    const userTradeHistory = await OnChainTrading.getTradingHistory(augur, db, {
      account: params.account,
      universe: params.universe,
    });

    const userPositions = await Users.getUserTradingPositions(augur, db, {
      account: params.account,
      universe: params.universe,
    });

    const userRawPositions = await Users.getRawUserTradingPositions(augur, db, {
      account: params.account,
      universe: params.universe,
    });

    const profitLoss = await Users.getProfitLossSummary(augur, db, {
      account: params.account,
      universe: params.universe,
      ignoreAwaitingAndFinalizedMarkets: true,
    });

    const funds = await Users.getTotalOnChainFrozenFunds(augur, db, {
      account: params.account,
      universe: params.universe,
    });
    if (profitLoss && Object.keys(profitLoss).length > 0) {
      userPositionTotals = {
        totalFrozenFunds: funds.totalFrozenFunds,
        totalRealizedPL: profitLoss[DAYS_IN_MONTH].realized,
        tradingPositionsTotal: {
          unrealizedRevenue24hChangePercent:
            profitLoss[ONE_DAY].unrealizedPercent,
        },
      };
    }

    return {
      userTradeHistory,
      userPositions,
      userRawPositions,
      userPositionTotals,
    };
  }

  @Getter('getUserFrozenFundsBreakdownParams')
  static async getUserFrozenFundsBreakdown(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Users.getUserFrozenFundsBreakdownParams>
  ): Promise<FrozenFundsBreakdown> {
    if (!params.account || !params.universe) {
      throw new Error(
        "'getUserFrozenFundsBreakdown' requires 'account' and 'universe' params to be provided"
      );
    }
    let frozenFundsBreakdown = {
      total: '0',
      openOrders: {
        total: '0',
        markets: {}
      },
      positions: {
        total: '0',
        markets: {}
      },
      createdMarkets: {
        total: '0',
        markets: {}
      }
    }
    // open orders
    const userOpenOrders = await Users.getUserOpenOrders(augur, db, {
      account: params.account,
      universe: params.universe,
    });
    const flattenOrders = collapseZeroXOrders(userOpenOrders.orders).filter(
      (order) => order.tokensEscrowed !== '0'
    );
    const groupedOrders = _.groupBy(flattenOrders, 'market');
    frozenFundsBreakdown.openOrders = {
        total: userOpenOrders.totalOpenOrdersFrozenFunds,
        markets: _.reduce(
          _.keys(groupedOrders),
          (summed, marketId) => ({
            ...summed,
            [marketId]: String(
              _.reduce(
                groupedOrders[marketId],
                (sum, order) => sum.plus(new BigNumber(order.tokensEscrowed)),
                new BigNumber(0)
              )
            ),
          }),
          {}
        ),
    };

    // positions
    const frozenFundsPerMarket = await getFrozenFundsPerMarket(db, params.account, params.universe);
    frozenFundsBreakdown.positions = {
      total: String(convertAttoValueToDisplayValue(frozenFundsPerMarket.frozenFundsTotal)),
      markets: frozenFundsPerMarket.frozenFundsPerMarket
    }
    // created markets
    const ownedMarketsResponse = await db.Markets.where('marketCreator')
      .equals(params.account)
      .and(log => !log.finalized)
      .toArray();
    const ownedMarkets = _.map(ownedMarketsResponse, 'market');
    let createdMarkets = {
      total: new BigNumber(0),
      markets: {},
    };
    for(let i=0; i< ownedMarkets.length; i++) {
      const marketId = ownedMarkets[i];
      const validityBond = await augur.contracts.hotLoading.getTotalValidityBonds_(
        [marketId]
      );
      createdMarkets.total = createdMarkets.total.plus(validityBond)
      createdMarkets.markets[marketId] = String(convertAttoValueToDisplayValue(validityBond));
    }
    frozenFundsBreakdown.createdMarkets = {
      total: String(convertAttoValueToDisplayValue(createdMarkets.total)),
      markets: createdMarkets.markets
    }
    frozenFundsBreakdown.total = String(
      new BigNumber(frozenFundsBreakdown.openOrders.total)
        .plus(new BigNumber(frozenFundsBreakdown.positions.total))
        .plus(new BigNumber(frozenFundsBreakdown.createdMarkets.total))
    );
    return frozenFundsBreakdown as FrozenFundsBreakdown;
  }

  @Getter('getUserAccountParams')
  static async getUserOpenOrders(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Users.getUserAccountParams>
  ): Promise<UserOpenOrders> {
    if (!params.account || !params.universe) {
      throw new Error(
        "'getUserOpenOrders' requires 'account' and 'universe' params to be provided"
      );
    }
    const orders = await OnChainTrading.getOpenOrders(augur, db, {
      account: params.account,
      universe: params.universe,
    });

    if (!orders || Object.keys(orders).length === 0)
      return { orders: {}, totalOpenOrdersFrozenFunds: '0' };

    const userPositions = await Users.getUserTradingPositions(augur, db, {
      account: params.account,
      universe: params.universe,
    });
    const userPositionsInMarket = _.groupBy(userPositions.tradingPositions, 'marketId')
    const positions = userPositions.tradingPositionsPerMarket;
    /*
      tokensEscrowed: string; // DAI
      sharesEscrowed: string; // Shares
    */
    const markets = await getMarkets(Object.keys(orders), db, false);
    let totalCost = ZERO;
    Object.keys(orders).forEach(marketId => {
      const market = markets[marketId];
      const marketPositions = positions[marketId];
      const userPositions = userPositionsInMarket[marketId];
      const userPostionsByOutcome = _.groupBy(userPositions, 'outcome');
      // need all outcomes represented in user shares balances
      const userSharesBalances = populateUserShareBalances(
        market.marketType === MarketType.Categorical
          ? market.outcomes.length
          : 3,
        marketPositions?.userSharesBalances || {}
      );
      const outcomes = Object.keys(orders[marketId]);
      outcomes.forEach(outcome => {
        const orderTypes = Object.keys(orders[marketId][outcome]);
        orderTypes.forEach(orderType => {
          const orderIds = Object.keys(orders[marketId][outcome][orderType]);
          orderIds.forEach(orderId => {
            const order = orders[marketId][outcome][orderType][orderId];
            const positions = userPostionsByOutcome && userPostionsByOutcome[outcome] && userPostionsByOutcome[outcome][0];
            addEscrowedAmountsDecrementShares(
              order,
              outcome,
              Number(orderType),
              market,
              userSharesBalances,
              positions
            );
            totalCost = totalCost.plus(new BigNumber(order.tokensEscrowed));
          });
        });
      });
    });
    return {
      orders,
      totalOpenOrdersFrozenFunds: totalCost.toString(),
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

    const marketsCreatedLog = await db.MarketCreated.where(
      '[universe+timestamp]'
    )
      .between(
        [universe, formattedStartTime],
        [universe, formattedEndTime],
        true,
        true
      )
      .and(log => {
        return log.marketCreator === params.account;
      })
      .toArray();

    const marketsCreated = marketsCreatedLog.length;

    const initialReporterReedeemedLogs = await db.InitialReporterRedeemed.where(
      'timestamp'
    )
      .between(formattedStartTime, formattedEndTime, true, true)
      .and(log => {
        return (
          log.reporter === params.account && log.universe === params.universe
        );
      })
      .toArray();

    const disputeCrowdsourcerReedeemedLogs = await db.DisputeCrowdsourcerRedeemed.where(
      'reporter'
    )
      .equals(params.account)
      .and(log => {
        if (log.universe !== params.universe) return false;
        if (log.timestamp < `0x${startTime.toString(16)}`) return false;
        if (log.timestamp > `0x${endTime.toString(16)}`) return false;
        return true;
      })
      .toArray();

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

    const orderFilledLogs = await db.ParsedOrderEvent.where(
      '[universe+eventType+timestamp]'
    )
      .between(
        [params.universe, OrderEventType.Fill, `0x${startTime.toString(16)}`],
        [params.universe, OrderEventType.Fill, `0x${endTime.toString(16)}`],
        true,
        true
      )
      .and(log => {
        return (
          log.orderCreator === params.account ||
          log.orderFiller === params.account
        );
      })
      .toArray();
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

    const profitLossChangedLogs = await db.ProfitLossChanged.where(
      '[universe+account+timestamp]'
    )
      .between(
        [params.universe, params.account, `0x${startTime.toString(16)}`],
        [params.universe, params.account, `0x${endTime.toString(16)}`],
        true,
        true
      )
      .and(log => {
        return log.netPosition !== '0x00';
      })
      .toArray();
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
  static async getRawUserTradingPositions(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Users.getUserTradingPositionsParams>
  ): Promise<UserTradingPositions> {
    if (!params.universe && !params.marketId) {
      throw new Error(
        "'getRawUserTradingPositions' requires a 'universe' or 'marketId' param be provided"
      );
    }
    let tradingPositions = null;
    let marketTradingPositions = null;

    const shareTokenBalances = await db.ShareTokenBalanceChangedRollup.where(
      '[universe+account]'
    )
      .equals([params.universe, params.account])
      .toArray();
    const shareTokenBalancesByMarket = _.groupBy(shareTokenBalances, 'market');
    const shareTokenBalancesByMarketAndOutcome = _.mapValues(
      shareTokenBalancesByMarket,
      marketShares => {
        return _.keyBy(marketShares, 'outcome');
      }
    );

    const marketIds = _.keys(shareTokenBalancesByMarketAndOutcome)
    const marketsData = await db.Markets.where('market')
      .anyOf(marketIds)
      .toArray();
    const markets = _.keyBy(marketsData, 'market');

    // map Latest PLs to Trading Positions
    const tradingPositionsByMarketAndOutcome = _.mapValues(
      shareTokenBalancesByMarketAndOutcome,
      shareTokenBalancesByOutcome => {
        return _.mapValues(
          shareTokenBalancesByOutcome,
          (shareTokenResult) => {
            const marketDoc = markets[shareTokenResult.market];

            const tickSize = numTicksToTickSize(
              new BigNumber(marketDoc.numTicks),
              new BigNumber(marketDoc.prices[0]),
              new BigNumber(marketDoc.prices[1])
            )

            const quantity: BigNumber = convertOnChainAmountToDisplayAmount(
              new BigNumber(shareTokenResult.balance),
              tickSize,
            );
            return {
              timestamp: 0,
              frozenFunds: "0",
              marketId: shareTokenResult.market,
              outcome: new BigNumber(shareTokenResult.outcome).toNumber(),
              netPosition: quantity.toFixed(),
              rawPosition: quantity.toFixed(),
              averagePrice: "0",
              realized: "0",
              unrealized: "0",
              unrealized24Hr: "0",
              total: "0",
              unrealizedCost: "0",
              realizedCost: "0",
              totalCost: "0",
              realizedPercent: "0",
              unrealizedPercent: "0",
              unrealized24HrPercent: "0",
              totalPercent: "0",
              currentValue: "0"
            }
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
    const tokenBalanceChangedLogs = await db.ShareTokenBalanceChangedRollup.where(
      '[account+market+outcome]'
    )
      .between(
        [params.account, Dexie.minKey],
        [params.account, Dexie.maxKey],
        true,
        true
      )
      .and(log => {
        return marketIds.includes(log.market);
      })
      .toArray();

    const marketOutcomeBalances = {};
    for (const tokenBalanceChangedLog of tokenBalanceChangedLogs) {
      if (!marketOutcomeBalances[tokenBalanceChangedLog.market]) {
        marketOutcomeBalances[tokenBalanceChangedLog.market] = {};
      }
      marketOutcomeBalances[tokenBalanceChangedLog.market][
        new BigNumber(tokenBalanceChangedLog.outcome).toNumber()
      ] = tokenBalanceChangedLog.balance;
    }

    for (const marketData of marketsData) {
      marketTradingPositions[
        marketData.market
      ].userSharesBalances = marketOutcomeBalances[marketData.market]
        ? Object.keys(marketOutcomeBalances[marketData.market]).reduce(
            (p, outcome) => {
              p[outcome] = String(
                convertOnChainAmountToDisplayAmount(
                  new BigNumber(
                    marketOutcomeBalances[marketData.market][outcome]
                  ),
                  numTicksToTickSize(
                    new BigNumber(marketData.numTicks),
                    new BigNumber(marketData.prices[0]),
                    new BigNumber(marketData.prices[1])
                  )
                )
              );
              return p;
            },
            {}
          )
        : {};
    }

    return {
      tradingPositions,
      tradingPositionsPerMarket: marketTradingPositions,
      unrealizedRevenue24hChangePercent:'0',
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
    let profitLossSummary = null;

    let profitLossCollection = await db.ProfitLossChanged.where(
      'account'
    ).equals(params.account);
    if (params.limit)
      profitLossCollection = profitLossCollection.limit(params.limit);
    if (params.offset)
      profitLossCollection = profitLossCollection.offset(params.offset);
    const profitLossRecords = await profitLossCollection
      .and(log => {
        if (params.universe && log.universe !== params.universe) return false;
        if (params.marketId && log.market !== params.marketId) return false;
        return true;
      })
      .toArray();
    const groupedProfitLossRecords = await getProfitLossRecordsByMarketAndOutcome(
      db,
      params.account,
      profitLossRecords
    );

    const profitLossResultsByMarketAndOutcome = reduceMarketAndOutcomeDocsToOnlyLatest(
      groupedProfitLossRecords
    );

    const profitLossResultsByMarketAndOutcomePrior = reduceMarketAndOutcomeDocsToOnlyPriorLatest(
      groupedProfitLossRecords,
      profitLossResultsByMarketAndOutcome
    );

    let allOrders: ParsedOrderEventLog[];
    if (params.marketId) {
      allOrders = await db.ParsedOrderEvent.where('[market+eventType]')
        .equals([params.marketId, OrderEventType.Fill])
        .toArray();
    } else {
      allOrders = await db.ParsedOrderEvent.where('eventType')
        .equals(OrderEventType.Fill)
        .toArray();
    }
    const allOrdersFilledResultsByMarketAndOutcome = reduceMarketAndOutcomeDocsToOnlyLatest(
      await getOrderFilledRecordsByMarketAndOutcome(db, allOrders)
    );

    const orders = _.filter(allOrders, log => {
      return (
        log.orderCreator === params.account ||
        log.orderFiller === params.account
      );
    });
    const ordersFilledResultsByMarketAndOutcome = reduceMarketAndOutcomeDocsToOnlyLatest(
      await getOrderFilledRecordsByMarketAndOutcome(db, orders)
    );

    const marketIds = _.keys(profitLossResultsByMarketAndOutcome);

    const marketsData = await db.Markets.where('market')
      .anyOf(marketIds)
      .toArray();
    const markets = _.keyBy(marketsData, 'market');

    const marketFinalizedResults = await db.MarketFinalized.where('market')
      .anyOf(marketIds)
      .toArray();
    const marketFinalizedByMarket = _.keyBy(marketFinalizedResults, 'market');

    const shareTokenBalances = await db.ShareTokenBalanceChangedRollup.where(
      '[universe+account]'
    )
      .equals([params.universe, params.account])
      .toArray();
    const shareTokenBalancesByMarket = _.groupBy(shareTokenBalances, 'market');
    const shareTokenBalancesByMarketAndOutcome = _.mapValues(
      shareTokenBalancesByMarket,
      marketShares => {
        return _.keyBy(marketShares, 'outcome');
      }
    );

    const endTime = await augur.contracts.augur.getTimestamp_();
    const periodInterval = ONE_DAY * 60 * 60 * 24;
    const startTime = endTime.minus(periodInterval);

    const last24HrFilledOrders = await db.ParsedOrderEvent.where(
      '[universe+eventType+timestamp]'
    )
      .between(
        [params.universe, OrderEventType.Fill, `0x${startTime.toString(16)}`],
        [params.universe, OrderEventType.Fill, `0x${endTime.toString(16)}`],
        true,
        true
      )
      .and(log => {
        return marketIds.includes(log.market);
      })
      .toArray();

    const last24HrFilledOrdersFilledResultsByMarketAndOutcome = reduceMarketAndOutcomeDocsToOnlyLatest(
      await getOrderFilledRecordsByMarketAndOutcome(db, last24HrFilledOrders)
    );

    // map Latest PLs to Trading Positions
    const tradingPositionsByMarketAndOutcome = _.mapValues(
      profitLossResultsByMarketAndOutcome,
      profitLossResultsByOutcome => {
        return _.mapValues(
          profitLossResultsByOutcome,
          (profitLossResult: ProfitLossChangedLog) => {
            let priorPosition = null;
            const marketDoc = markets[profitLossResult.market];
            if (
              !ordersFilledResultsByMarketAndOutcome[profitLossResult.market] ||
              !ordersFilledResultsByMarketAndOutcome[profitLossResult.market][
                profitLossResult.outcome
              ]
            ) {
              return null;
            }
            const outcomeValue24Hr =
              last24HrFilledOrdersFilledResultsByMarketAndOutcome[
                profitLossResult.market
              ] &&
              last24HrFilledOrdersFilledResultsByMarketAndOutcome[
                profitLossResult.market
              ][profitLossResult.outcome]
                ? new BigNumber(
                    last24HrFilledOrdersFilledResultsByMarketAndOutcome[
                      profitLossResult.market
                    ][profitLossResult.outcome].price
                  )
                : undefined;
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
            } else if (
              marketDoc.tentativeWinningPayoutNumerators &&
              marketDoc.reportingState ===
                MarketReportingState.AwaitingFinalization
            ) {
              outcomeValue = new BigNumber(
                marketDoc.tentativeWinningPayoutNumerators[
                  new BigNumber(profitLossResult.outcome).toNumber()
                ]
              );
            }
            // net position is 0, must have claimed, get prior order for display use
            if (
              new BigNumber(profitLossResult.netPosition).eq(0) &&
              profitLossResultsByMarketAndOutcomePrior[
                profitLossResult.market
              ] &&
              profitLossResultsByMarketAndOutcomePrior[profitLossResult.market][
                profitLossResult.outcome
              ]
            ) {
              const prior =
                profitLossResultsByMarketAndOutcomePrior[
                  profitLossResult.market
                ][profitLossResult.outcome];
              priorPosition = getDisplayValuesForPosition(prior, marketDoc);
            }
            const tradingPosition = {
              ...getTradingPositionFromProfitLossFrame(
                profitLossResult,
                marketDoc,
                outcomeValue,
                outcomeValue24Hr,
                new BigNumber(profitLossResult.timestamp).toNumber(),
                shareTokenBalancesByMarketAndOutcome,
                !!marketFinalizedByMarket[profitLossResult.market]
              ),
              priorPosition,
            };

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
    const tokenBalanceChangedLogs = await db.ShareTokenBalanceChangedRollup.where(
      '[account+market+outcome]'
    )
      .between(
        [params.account, Dexie.minKey],
        [params.account, Dexie.maxKey],
        true,
        true
      )
      .and(log => {
        return marketIds.includes(log.market);
      })
      .toArray();

    const marketOutcomeBalances = {};
    for (const tokenBalanceChangedLog of tokenBalanceChangedLogs) {
      if (!marketOutcomeBalances[tokenBalanceChangedLog.market]) {
        marketOutcomeBalances[tokenBalanceChangedLog.market] = {};
      }
      marketOutcomeBalances[tokenBalanceChangedLog.market][
        new BigNumber(tokenBalanceChangedLog.outcome).toNumber()
      ] = tokenBalanceChangedLog.balance;
    }

    // tradingPositions filters out users create open orders, need to use `profitLossResultsByMarketAndOutcome` to calc total frozen funds
    const allProfitLossResults = _.flatten(
      _.values(_.mapValues(profitLossResultsByMarketAndOutcome, _.values))
    );

    const fullTotalLossMarketsPositions = await getFullMarketPositionLoss(
      db,
      allProfitLossResults,
      shareTokenBalancesByMarketAndOutcome
    );

    for (const marketData of marketsData) {
      marketTradingPositions[
        marketData.market
      ].fullLoss = !!fullTotalLossMarketsPositions.includes(marketData.market);
      marketTradingPositions[marketData.market].unclaimedProceeds = '0';
      marketTradingPositions[marketData.market].unclaimedProfit = '0';
      marketTradingPositions[marketData.market].fee = '0';
      if (
        marketData.reportingState === MarketReportingState.Finalized ||
        marketData.reportingState === MarketReportingState.AwaitingFinalization
      ) {
        if (marketData.tentativeWinningPayoutNumerators) {
          const reportingFeeLog = _.last(
            _.sortBy(
              await db.ReportingFeeChanged.where('universe')
                .equals(params.universe)
                .toArray(),
              'blockNumber'
            )
          );
          const reportingFeeDivisor = new BigNumber(
            reportingFeeLog
              ? reportingFeeLog.reportingFee
              : INIT_REPORTING_FEE_DIVISOR
          );
          for (const tentativeWinningPayoutNumerator in marketData.tentativeWinningPayoutNumerators) {
            if (
              marketOutcomeBalances[marketData.market] &&
              marketData.tentativeWinningPayoutNumerators[
                tentativeWinningPayoutNumerator
              ] !== '0x00' &&
              !!marketOutcomeBalances[marketData.market][
                tentativeWinningPayoutNumerator
              ]
            ) {
              const numShares = new BigNumber(
                marketOutcomeBalances[marketData.market][
                  tentativeWinningPayoutNumerator
                ]
              );
              const ONE = new BigNumber(1);
              const feePercentage = ONE.div(
                new BigNumber(marketData.feeDivisor)
              ).plus(ONE.div(new BigNumber(reportingFeeDivisor)));
              const shareValue = convertAttoValueToDisplayValue(
                numShares.times(
                  marketData.tentativeWinningPayoutNumerators[
                    tentativeWinningPayoutNumerator
                  ]
                )
              );
              const feeAmount = shareValue.times(feePercentage);
              const unclaimedProceeds = shareValue.minus(feeAmount);
              marketTradingPositions[
                marketData.market
              ].unclaimedProceeds = new BigNumber(
                marketTradingPositions[marketData.market].unclaimedProceeds
              )
                .plus(unclaimedProceeds)
                .toFixed(4);

              marketTradingPositions[
                marketData.market
              ].unclaimedProfit = new BigNumber(unclaimedProceeds)
                .minus(
                  new BigNumber(
                    marketTradingPositions[marketData.market].unrealizedCost
                  )
                )
                .toFixed(4);

              marketTradingPositions[marketData.market].fee = new BigNumber(
                marketTradingPositions[marketData.market].fee
              )
                .plus(feeAmount)
                .toFixed(4);
            }
          }
        }
      }
    }

    for (const marketData of marketsData) {
      marketTradingPositions[
        marketData.market
      ].userSharesBalances = marketOutcomeBalances[marketData.market]
        ? Object.keys(marketOutcomeBalances[marketData.market]).reduce(
            (p, outcome) => {
              p[outcome] = String(
                convertOnChainAmountToDisplayAmount(
                  new BigNumber(
                    marketOutcomeBalances[marketData.market][outcome]
                  ),
                  numTicksToTickSize(
                    new BigNumber(marketData.numTicks),
                    new BigNumber(marketData.prices[0]),
                    new BigNumber(marketData.prices[1])
                  )
                )
              );
              return p;
            },
            {}
          )
        : {};
    }

    const universe = params.universe
      ? params.universe
      : await augur.getMarket(params.marketId).getUniverse_();
    profitLossSummary = await Users.getProfitLossSummary(augur, db, {
      universe,
      account: params.account,
      ignoreAwaitingAndFinalizedMarkets: true,
    });

    return {
      tradingPositions,
      tradingPositionsPerMarket: marketTradingPositions,
      unrealizedRevenue24hChangePercent:
        (profitLossSummary && profitLossSummary[ONE_DAY].unrealizedPercent) ||
        '0',
    };
  }

  @Getter('getTotalOnChainFrozenFundsParams')
  static async getTotalOnChainFrozenFunds(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Users.getTotalOnChainFrozenFundsParams>
  ): Promise<UserTotalOnChainFrozenFunds> {
    if (!params.universe || !params.account) {
      throw new Error(
        "'getTotalOnChainFrozenFunds' requires a 'universe' and 'account' param be provided"
      );
    }

    const frozenFundsPerMarket = await getFrozenFundsPerMarket(db, params.account, params.universe);

    // includes validity bonds for market creations
    const ownedMarketsResponse = await db.Markets.where('marketCreator')
      .equals(params.account)
      .and(log => !log.finalized)
      .toArray();
    const ownedMarkets = _.map(ownedMarketsResponse, 'market');
    const totalValidityBonds = await augur.contracts.hotLoading.getTotalValidityBonds_(
      ownedMarkets
    );

    return {
      totalFrozenFunds: totalValidityBonds
        .plus(frozenFundsPerMarket.frozenFundsTotal)
        .dividedBy(QUINTILLION)
        .toFixed(),
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
    const ignoreAwaitingAndFinalizedMarkets =
      params.ignoreAwaitingAndFinalizedMarkets;
    const now = await augur.contracts.augur.getTimestamp_();
    const startTime = params.startTime!;
    const endTime = params.endTime || now.toNumber();
    const periodInterval =
      typeof params.periodInterval === 'undefined'
        ? Math.ceil((endTime - startTime) / DEFAULT_NUMBER_OF_BUCKETS)
        : params.periodInterval;

    const profitLossOrders = await db.ProfitLossChanged.where(
      '[universe+account+timestamp]'
    )
      .between(
        [params.universe, params.account, Dexie.minKey],
        [params.universe, params.account, Dexie.maxKey]
      )
      .toArray();
    let profitLossByMarketAndOutcome = await getProfitLossRecordsByMarketAndOutcome(
      db,
      params.account!,
      profitLossOrders
    );

    const orders = await db.ParsedOrderEvent.where(
      '[universe+eventType+timestamp]'
    )
      .between(
        [params.universe, OrderEventType.Fill, `0x${startTime.toString(16)}`],
        [params.universe, OrderEventType.Fill, `0x${endTime.toString(16)}`],
        true,
        true
      )
      .toArray();
    const ordersFilledResultsByMarketAndOutcome = await getOrderFilledRecordsByMarketAndOutcome(
      db,
      orders
    );

    const marketIds = _.keys(profitLossByMarketAndOutcome);

    const marketFinalizedResults = await db.MarketFinalized.where('market')
      .anyOf(marketIds)
      .and(log => {
        return (
          log.timestamp <= `0x${endTime.toString(16)}` &&
          log.timestamp >= `0x${startTime.toString(16)}`
        );
      })
      .toArray();
    const marketFinalizedByMarket = _.keyBy(marketFinalizedResults, 'market');

    const marketsResponse = await db.Markets.where('market')
      .anyOf(marketIds)
      .toArray();
    const markets = _.keyBy(marketsResponse, 'market');

    const shareTokenBalances = await db.ShareTokenBalanceChangedRollup.where(
      '[universe+account]'
    )
      .equals([params.universe, params.account])
      .toArray();
    const shareTokenBalancesByMarket = _.groupBy(shareTokenBalances, 'market');
    const shareTokenBalancesByMarketAndOutcome = _.mapValues(
      shareTokenBalancesByMarket,
      marketShares => {
        return _.keyBy(marketShares, 'outcome');
      }
    );

    if (ignoreAwaitingAndFinalizedMarkets) {
      profitLossByMarketAndOutcome = _.reduce(
        Object.keys(profitLossByMarketAndOutcome),
        (filteredMarkets, marketId) => {
          const marketDoc = markets[marketId];
          if (
            marketDoc.reportingState ===
              MarketReportingState.AwaitingFinalization ||
            marketDoc.reportingState === MarketReportingState.Finalized
          ) {
            return filteredMarkets;
          }
          return {
            ...filteredMarkets,
            [marketId]: profitLossByMarketAndOutcome[marketId],
          };
        },
        {}
      );
    }

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
              // if market not traded in timeframe use last pl avg price
              let lastPrice = null;
              if (latestOutcomePLValue) {
                lastPrice = new BigNumber(latestOutcomePLValue.avgPrice).div(
                  10 ** 18
                );
              }
              if (
                ordersFilledResultsByMarketAndOutcome[marketId] &&
                ordersFilledResultsByMarketAndOutcome[marketId][outcome]
              ) {
                const last = getLastDocBeforeTimestamp<ParsedOrderEventLog>(
                  ordersFilledResultsByMarketAndOutcome[marketId][outcome],
                  bucketTimestamp
                );
                if (last) lastPrice = new BigNumber(last.price);
              }
              const finalized =
                !!marketFinalizedByMarket[marketId] &&
                new BigNumber(marketFinalizedByMarket[marketId].timestamp).lte(
                  bucketTimestamp
                );
              const hasOutcomeValues = lastPrice !== null || finalized;
              if (!latestOutcomePLValue || !hasOutcomeValues) {
                return {
                  timestamp: bucketTimestamp.toNumber(),
                  frozenFunds: '0',
                  marketId: '',
                  realized: '0',
                  unrealized: '0',
                  unrealized24Hr: '0',
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
              let outcomeValue: BigNumber;
              if (finalized) {
                outcomeValue = new BigNumber(
                  marketFinalizedByMarket[marketId].winningPayoutNumerators[
                    new BigNumber(outcome).toNumber()
                  ]
                );
              } else {
                // if market is finalized set last price to minPrice
                outcomeValue = marketFinalizedByMarket[marketId]
                  ? new BigNumber(marketDoc.prices[0])
                  : lastPrice;
              }
              return getTradingPositionFromProfitLossFrame(
                latestOutcomePLValue,
                marketDoc,
                outcomeValue,
                undefined,
                bucketTimestamp.toNumber(),
                finalized ? shareTokenBalancesByMarketAndOutcome : null,
                finalized
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

    for (const days of [ONE_DAY, DAYS_IN_MONTH]) {
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
          ignoreAwaitingAndFinalizedMarkets:
            days === ONE_DAY ? params.ignoreAwaitingAndFinalizedMarkets : false,
        }
      );

      if (rest.length !== 0) {
        throw new Error(
          'PL calculation in summary returning more thant two bucket'
        );
      }
      result[days] = endProfit;
    }
    return result;
  }
}

function sumTradingPositions(
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
      const unrealized24Hr = new BigNumber(resultPosition.unrealized24Hr).plus(
        tradingPosition.unrealized24Hr
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
        unrealized24Hr: unrealized24Hr.toFixed(),
        total: '0',
        unrealizedCost: unrealizedCost.toFixed(),
        realizedCost: realizedCost.toFixed(),
        totalCost: '0',
        realizedPercent: '0',
        unrealizedPercent: '0',
        unrealized24HrPercent: '0',
        totalPercent: '0',
        currentValue: currentValue.toFixed(),
        userSharesBalances: {},
      };
    },
    {
      timestamp: 0,
      frozenFunds: '0',
      marketId: '',
      realized: '0',
      unrealized: '0',
      unrealized24Hr: '0',
      total: '0',
      unrealizedCost: '0',
      realizedCost: '0',
      totalCost: '0',
      realizedPercent: '0',
      unrealizedPercent: '0',
      unrealized24HrPercent: '0',
      totalPercent: '0',
      currentValue: '0',
      userSharesBalances: {},
    } as MarketTradingPosition
  );

  const frozenFunds = new BigNumber(summedTrade.frozenFunds);
  const realized = new BigNumber(summedTrade.realized);
  const unrealized = new BigNumber(summedTrade.unrealized);
  const unrealized24Hr = new BigNumber(summedTrade.unrealized24Hr);
  const realizedCost = new BigNumber(summedTrade.realizedCost);
  const unrealizedCost = new BigNumber(summedTrade.unrealizedCost);

  const total = realized.plus(unrealized);
  const totalCost = realizedCost.plus(unrealizedCost).abs();
  summedTrade.realized = realized.toFixed();
  summedTrade.frozenFunds = frozenFunds.toFixed();
  summedTrade.total = total.toFixed();
  summedTrade.totalCost = totalCost.toFixed();
  summedTrade.unrealized = unrealized.toFixed();
  summedTrade.unrealized24Hr = unrealized24Hr.toFixed();
  summedTrade.realizedPercent = realizedCost.isZero()
    ? '0'
    : realized.dividedBy(realizedCost).toFixed(4);
  summedTrade.unrealizedPercent = unrealizedCost.isZero()
    ? '0'
    : unrealized.dividedBy(unrealizedCost).toFixed(4);
  summedTrade.unrealized24HrPercent = unrealizedCost.isZero()
    ? '0'
    : unrealized24Hr.dividedBy(unrealizedCost).toFixed(4);
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
            (latestResult.blockNumber === outcomeResult.blockNumber &&
              latestResult.logIndex < outcomeResult.logIndex)
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

function reduceMarketAndOutcomeDocsToOnlyPriorLatest<
  TDoc extends ProfitLossChangedLog
>(
  docs: _.Dictionary<_.Dictionary<ProfitLossChangedLog[]>>,
  latest: _.Dictionary<_.Dictionary<ProfitLossChangedLog>>
): _.Dictionary<_.Dictionary<ProfitLossChangedLog>> {
  return _.mapValues(docs, marketResults => {
    return _.mapValues(marketResults, outcomeResults => {
      return _.reduce(
        outcomeResults,
        (priorResult: ProfitLossChangedLog, outcomeResult) => {
          let result = priorResult;
          const endResult = latest[outcomeResult.market][outcomeResult.outcome];
          if (endResult.blockHash === outcomeResult.blockHash)
            return priorResult;
          if (!priorResult) return outcomeResult;
          if (priorResult.blockNumber < outcomeResult.blockNumber)
            result = outcomeResult;
          if (
            priorResult.blockNumber === outcomeResult.blockNumber &&
            outcomeResult.logIndex > priorResult.logIndex
          )
            result = outcomeResult;
          if (endResult && endResult.blockNumber < result.blockNumber)
            result = priorResult;
          if (
            endResult &&
            endResult.blockNumber === result.blockNumber &&
            result.logIndex > endResult.logIndex
          )
            result = priorResult;
          return result;
        },
        outcomeResults[0]
      );
    });
  });
}

function getLastDocBeforeTimestamp<TDoc extends { timestamp: LogTimestamp }>(
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

function populateUserShareBalances(
  numOutcomes: number,
  userSharesBalances: { [outcome: string]: string }
): { [outcome: string]: string } {
  return new Array(numOutcomes)
    .fill('0')
    .reduce(
      (p, v, index) =>
        userSharesBalances[index]
          ? { ...p, [index]: userSharesBalances[index] }
          : { ...p, [index]: '0' },
      {}
    );
}

function addEscrowedAmountsDecrementShares(
  order: Order,
  outcome: string,
  orderType: number,
  market: MarketData,
  userSharesBalances: { [outcome: string]: string },
  position?: TradingPosition,
) {
  let cost = ZERO;
  const maxPrice = new BigNumber(market.prices[1]);
  const minPrice = new BigNumber(market.prices[0]);
  const displayMaxPrice = maxPrice.dividedBy(QUINTILLION);
  const displayMinPrice = minPrice.dividedBy(QUINTILLION);
  const isCurrentlyLong = position && new BigNumber(position.netPosition).gt(ZERO);
  let sharesUsed = ZERO;

  if (new BigNumber(orderType).eq(ORDER_TYPES.BID)) {
    const userSharesBalancesRemoveOutcome = Object.keys(
      userSharesBalances
    ).reduce(
      (p, o) =>
        outcome === o ? p : [...p, new BigNumber(userSharesBalances[o])],
      []
    );
    const minOutcomeShareAmount =
      userSharesBalancesRemoveOutcome.length > 0
        ? BigNumber.min(...userSharesBalancesRemoveOutcome)
        : ZERO;
    sharesUsed = BigNumber.min(
      new BigNumber(order.amount),
      minOutcomeShareAmount
    );

    const amt = new BigNumber(order.amount).minus(sharesUsed);
    cost = amt.times(new BigNumber(order.price).minus(displayMinPrice));

    Object.keys(userSharesBalances).forEach(o => {
      if (outcome !== o) {
        userSharesBalances[o] = new BigNumber(userSharesBalances[o])
          .minus(sharesUsed)
          .toString();
      }
    });
  } else {
    const sharesBN = isCurrentlyLong ? new BigNumber(userSharesBalances[outcome] || '0') : ZERO;
    sharesUsed = BigNumber.min(new BigNumber(order.amount), sharesBN);

    cost = new BigNumber(order.amount)
      .minus(sharesUsed)
      .times(displayMaxPrice.minus(new BigNumber(order.price)));

    userSharesBalances[outcome] = sharesBN.gt(ZERO)
      ? sharesBN.minus(sharesUsed).toString()
      : sharesBN.toString();
  }

  order.tokensEscrowed = cost.toString();
  order.sharesEscrowed = sharesUsed.toString();
}

function getTradingPositionFromProfitLossFrame(
  profitLossFrame: ProfitLossChangedLog,
  marketDoc: MarketData,
  onChainOutcomeValue: BigNumber,
  onChain24HrOutcomeValue: BigNumber | undefined,
  timestamp: number,
  shareTokenBalancesByMarketAndOutcome,
  finalized: boolean
): TradingPosition {
  const minPrice = new BigNumber(marketDoc.prices[0]);
  const maxPrice = new BigNumber(marketDoc.prices[1]);
  const numTicks = new BigNumber(marketDoc.numTicks);
  const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);

  const onChainFrozenFunds = new BigNumber(profitLossFrame.frozenFunds).div(
    10 ** 18
  );
  const onChainNetPosition = new BigNumber(profitLossFrame.netPosition);
  const onChainAvgPrice = new BigNumber(profitLossFrame.avgPrice).div(10 ** 18);
  const onChainRealizedProfit = new BigNumber(
    profitLossFrame.realizedProfit
  ).div(10 ** 18);
  const onChainRealizedCost = new BigNumber(profitLossFrame.realizedCost).div(
    10 ** 18
  );
  let onChainRawPosition = ZERO;
  if (
    shareTokenBalancesByMarketAndOutcome &&
    shareTokenBalancesByMarketAndOutcome[marketDoc.market] &&
    shareTokenBalancesByMarketAndOutcome[marketDoc.market][
      profitLossFrame.outcome
    ]
  ) {
    onChainRawPosition = new BigNumber(
      shareTokenBalancesByMarketAndOutcome[marketDoc.market][
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
  let realizedProfit = onChainRealizedProfit.dividedBy(10 ** 18);
  let avgPrice: BigNumber = convertOnChainPriceToDisplayPrice(
    onChainAvgPrice,
    minPrice,
    tickSize
  );
  let realizedCost = onChainRealizedCost.dividedBy(10 ** 18);
  let unrealizedCost = onChainUnrealizedCost.dividedBy(10 ** 18);

  const lastTradePrice: BigNumber = convertOnChainPriceToDisplayPrice(
    onChainOutcomeValue,
    minPrice,
    tickSize
  );

  const last24HrTradePrice = onChain24HrOutcomeValue
    ? convertOnChainPriceToDisplayPrice(onChainOutcomeValue, minPrice, tickSize)
    : undefined;

  let unrealized = netPosition
    .abs()
    .multipliedBy(
      onChainNetPosition.isNegative()
        ? avgPrice.minus(lastTradePrice)
        : lastTradePrice.minus(avgPrice)
    );

  let unrealized24Hr = onChain24HrOutcomeValue
    ? netPosition
        .abs()
        .multipliedBy(
          onChainNetPosition.isNegative()
            ? avgPrice.minus(last24HrTradePrice)
            : last24HrTradePrice.minus(avgPrice)
        )
    : ZERO;

  const shortPrice = maxPrice.dividedBy(10 ** 18).minus(lastTradePrice);
  const currentValue = netPosition
    .abs()
    .multipliedBy(
      onChainNetPosition.isNegative() ? shortPrice : lastTradePrice
    );

  let totalCost = unrealizedCost.plus(realizedCost);

  if (finalized) {
    realizedCost = unrealizedCost.plus(realizedCost);
    realizedProfit = realizedProfit.plus(unrealized);
    unrealized = ZERO;
    unrealized24Hr = ZERO;
    unrealizedCost = ZERO;
    avgPrice = onChainNetPosition.eq(0) ? ZERO : avgPrice;
  }

  const unrealized24HrPercent = unrealizedCost.isZero()
    ? ZERO
    : unrealized24Hr.dividedBy(unrealizedCost);
  const unrealizedPercent = unrealizedCost.isZero()
    ? ZERO
    : unrealized.dividedBy(unrealizedCost);

  const totalPercent = realizedProfit
    .plus(unrealized)
    .dividedBy(realizedCost.plus(unrealizedCost));

  const realizedPercent = realizedCost.isZero()
    ? ZERO
    : realizedProfit.dividedBy(realizedCost.abs());

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
    unrealized24Hr: unrealized24Hr.toFixed(),
    total: realizedProfit.plus(unrealized).toFixed(),
    unrealizedCost: unrealizedCost.toFixed(),
    realizedCost: realizedCost.toFixed(),
    totalCost: totalCost.toFixed(),
    realizedPercent: realizedPercent.toFixed(4),
    unrealizedPercent: unrealizedPercent.toFixed(4),
    unrealized24HrPercent: unrealized24HrPercent.toFixed(4),
    totalPercent: totalPercent.toFixed(4),
    currentValue: currentValue.toFixed(),
  } as TradingPosition;
}

function getDisplayValuesForPosition(
  profitLossFrame: ProfitLossChangedLog,
  marketDoc: MarketData
) {
  const minPrice = new BigNumber(marketDoc.prices[0]);
  const maxPrice = new BigNumber(marketDoc.prices[1]);
  const numTicks = new BigNumber(marketDoc.numTicks);
  const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
  const onChainAvgPrice = new BigNumber(profitLossFrame.avgPrice).div(10 ** 18);
  const onChainNetPosition = new BigNumber(profitLossFrame.netPosition);
  // convert prior to display values
  const netPosition = convertOnChainAmountToDisplayAmount(
    new BigNumber(profitLossFrame.netPosition),
    tickSize
  );
  const avgPrice: BigNumber = convertOnChainPriceToDisplayPrice(
    onChainAvgPrice,
    minPrice,
    tickSize
  );
  const onChainAvgCost = onChainNetPosition.isNegative()
    ? numTicks.minus(onChainAvgPrice)
    : onChainAvgPrice;
  const onChainUnrealizedCost = onChainNetPosition
    .abs()
    .multipliedBy(onChainAvgCost);

  return {
    unrealizedCost: onChainUnrealizedCost.dividedBy(10 ** 18).toFixed(),
    avgPrice: avgPrice.toFixed(),
    netPosition: netPosition.toFixed(),
  };
}

async function getFullMarketPositionLoss(
  db,
  allProfitLossResults,
  shareTokenBalancesByMarketAndOutcome
): Promise<string[]> {
  const marketFinalizedResults = await db.MarketFinalized.where('market')
    .anyOf(_.map(allProfitLossResults, 'market'))
    .toArray();

  const finalizedMarketIds = _.map(marketFinalizedResults, 'market');
  const marketsData = await db.Markets.where('market')
    .anyOf(_.map(marketFinalizedResults, 'market'))
    .toArray();
  const markets = _.keyBy(marketsData, 'market');

  return _.reduce(
    finalizedMarketIds,
    (result, marketId) => {
      const marketDoc = markets[marketId];
      const payoutNumerators = marketDoc.winningPayoutNumerators;
      const outcomeBalance = shareTokenBalancesByMarketAndOutcome[marketId];
      const totalPositionValue = _.reduce(
        payoutNumerators,
        (sum, outcome, index) => {
          const balance = new BigNumber(
            outcomeBalance[`0x0${index}`]?.balance || 0
          );
          return sum.plus(balance.times(outcome));
        },
        ZERO
      );
      return totalPositionValue.gt(0) ? result : [...result, marketId];
    },
    []
  );
}

async function getFrozenFundsPerMarket(
  db: DB,
  account: string,
  universe: string
) {
  const profitLossRecords = await db.ProfitLossChanged.where('account')
    .equals(account)
    .and((log) => {
      if (universe && log.universe !== universe) return false;
      return true;
    })
    .toArray();

  const profitLossResultsByMarketAndOutcome = reduceMarketAndOutcomeDocsToOnlyLatest(
    await getProfitLossRecordsByMarketAndOutcome(db, account, profitLossRecords)
  );
  const profitLossResultsByMarket = _.mapValues(
    profitLossResultsByMarketAndOutcome,
    _.values
  );

  const allProfitLossResults = _.flatten(_.values(profitLossResultsByMarket));

  const totalFrozenFundsByMarket = _.mapValues(
    profitLossResultsByMarket,
    (ffs) => {
      return _.reduce(
        ffs,
        (accumulator, ff) => accumulator.plus(ff.frozenFunds),
        ZERO
      );
    }
  );

  const shareTokenBalances = await db.ShareTokenBalanceChangedRollup.where(
    '[universe+account]'
  )
    .equals([universe, account])
    .toArray();
  const shareTokenBalancesByMarket = _.groupBy(shareTokenBalances, 'market');
  const shareTokenBalancesByMarketAndOutcome = _.mapValues(
    shareTokenBalancesByMarket,
    marketShares => {
      return _.keyBy(marketShares, 'outcome');
    }
  );

  // if winning position value is less than frozen funds, market position is complete loss
  // if complete loss then ignore profit loss in frozen funds
  const fullTotalLossMarketsPositions = await getFullMarketPositionLoss(
    db,
    allProfitLossResults,
    shareTokenBalancesByMarketAndOutcome
  );

  const frozenFundsPerMarket = Object.entries(totalFrozenFundsByMarket)
  .filter(
    ([market, ff]) =>
      ff.gt(ZERO) && !fullTotalLossMarketsPositions.includes(market)
  )
  .reduce((accum, [market, ff]) => ({...accum, [market]: String(convertAttoValueToDisplayValue(ff.div(QUINTILLION)))}), {})

  const frozenFundsTotal = Object.entries(totalFrozenFundsByMarket)
  .filter(
    ([market, ff]) =>
      ff.gt(ZERO) && !fullTotalLossMarketsPositions.includes(market)
  )
  .reduce((accum, [market, ff]) => accum.plus(ff), ZERO)
  .dividedBy(QUINTILLION);

  return {
    frozenFundsTotal,
    frozenFundsPerMarket
  }
}

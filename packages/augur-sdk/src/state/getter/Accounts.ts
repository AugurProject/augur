import { BigNumber } from 'bignumber.js';
import { DB } from '../db/DB';
import { Getter } from './Router';
import {
  CompleteSetsPurchasedLog,
  CompleteSetsSoldLog,
  DisputeCrowdsourcerContributionLog,
  DisputeCrowdsourcerRedeemedLog,
  InitialReporterRedeemedLog,
  InitialReportSubmittedLog,
  MarketCreatedLog,
  MarketData,
  OrderType,
  ParsedOrderEventLog,
  ParticipationTokensRedeemedLog,
  TradingProceedsClaimedLog,
  MarketType,
  CommonOutcomes,
  CancelledOrderLog
} from '../logs/types';
import { sortOptions } from './types';
import {
  Augur,
  calculatePayoutNumeratorsValue,
  convertOnChainAmountToDisplayAmount,
  describeMarketOutcome,
  describeUniverseOutcome,
  marketTypeToName,
  PayoutNumeratorValue
} from '../../index';
import { MarketReportingState } from '../../constants';
import { compareObjects, convertOnChainPriceToDisplayPrice, numTicksToTickSize, convertAttoValueToDisplayValue } from '../../utils';
import * as _ from 'lodash';
import * as t from 'io-ts';
import Dexie from 'dexie';
import { StoredOrder } from '../db/ZeroXOrders';

export enum Action {
  ALL = 'ALL',
  BUY = 'BUY',
  SELL = 'SELL',
  CANCEL = 'CANCEL',
  OPEN = 'OPEN',
  FILLED = 'FILLED',
  CLAIM_PARTICIPATION_TOKENS = 'CLAIM_PARTICIPATION_TOKENS',
  CLAIM_TRADING_PROCEEDS = 'CLAIM_TRADING_PROCEEDS',
  CLAIM_WINNING_CROWDSOURCERS = 'CLAIM_WINNING_CROWDSOURCERS',
  DISPUTE = 'DISPUTE',
  INITIAL_REPORT = 'INITIAL_REPORT',
  MARKET_CREATION = 'MARKET_CREATION',
}

export enum Coin {
  ALL = 'ALL',
  ETH = 'ETH',
  REP = 'REP',
  DAI = 'DAI',
}

export const actionnDeserializer = t.keyof(Action);
export const coinDeserializer = t.keyof(Coin);

const getAccountTransactionHistoryParamsSpecific = t.type({
  universe: t.string,
  account: t.string,
  earliestTransactionTime: t.union([t.number, t.null, t.undefined]),
  latestTransactionTime: t.union([t.number, t.null, t.undefined]),
  coin: t.union([coinDeserializer, t.null, t.undefined]),
  action: t.union([actionnDeserializer, t.null, t.undefined]),
});

const getAccountRepStakeSummaryParamsSpecific = t.type({
  universe: t.string,
  account: t.string,
});

const getUserCurrentDisputeStakeParams = t.type({
  marketId: t.string,
  account: t.string,
});

export interface ContractInfo {
  address: string;
  amount: string;
  marketId: string;
  isClaimable: boolean;
}

export interface ContractOverview {
  totalStaked: string;
  totalClaimable: string;
  contracts: ContractInfo[];
}

export interface ParticipationContract {
  address: string;
  amount: string;
  amountFees: string;
  isClaimable: boolean;
}

export interface ParticipationOverview {
  totalStaked: string;
  totalClaimable: string;
  totalFees: string;
  contracts: ParticipationContract[];
}

export interface AccountReportingHistory {
  repWinnings: string;
  reporting: ContractOverview | null;
  disputing: ContractOverview | null;
  participationTokens: ParticipationOverview;
}

export interface AccountTransaction {
  action: string;
  coin: string;
  details: string;
  fee: string;
  marketDescription: string;
  outcome: number | null;
  outcomeDescription: string | null;
  price: string;
  quantity: string;
  timestamp: number;
  total: string;
  transactionHash: string;
}

export interface MarketCreatedInfo {
  [key: string]: MarketData;
}

export interface UserCurrentOutcomeDisputeStake {
  outcome: string,
  isInvalid: boolean,
  malformed?: boolean,
  payoutNumerators: string[],
  userStakeCurrent: string,
}

export class Accounts<TBigNumber> {
  static getAccountTransactionHistoryParams = t.intersection([
    getAccountTransactionHistoryParamsSpecific,
    sortOptions,
  ]);

  static getAccountRepStakeSummaryParams = getAccountRepStakeSummaryParamsSpecific;

  static getUserCurrentDisputeStakeParams = getUserCurrentDisputeStakeParams;

  @Getter('getAccountRepStakeSummaryParams')
  static async getAccountRepStakeSummary<TBigNumber>(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Accounts.getAccountRepStakeSummaryParams>
  ): Promise<AccountReportingHistory> {

    // Note: we could created a derived DB to do the four lines below in one query. Its unlikely we'll need that though (at least anytime soon) since a single users reports wont scale too high
    const initialReportSubmittedLogs = await db.InitialReportSubmitted.where('reporter').equalsIgnoreCase(params.account).and((log) => log.universe === params.universe).toArray();
    const initialReportRedeemedLogs = await db.InitialReporterRedeemed.where('reporter').equalsIgnoreCase(params.account).and((log) => log.universe === params.universe).toArray();
    const redeemedReports = _.keyBy(initialReportRedeemedLogs, 'market');
    const unredeemedReports = _.filter(initialReportSubmittedLogs, (initialReport) => !redeemedReports[initialReport.market]);

    // get token balance of crowdsourcers
    const disputeCrowdsourcerTokens = await db.TokenBalanceChangedRollup.where('[universe+owner+tokenType]').equals([params.universe, params.account, 1]).and((log) => {
      return log.balance > '0x00';
    }).toArray();
    const crowdsourcers = _.uniq(_.map(disputeCrowdsourcerTokens, 'token'));
    // get created and completed logs for these addresses
    const disputeCrowdsourcerCreatedLogs = await db.DisputeCrowdsourcerCreated.where('disputeCrowdsourcer').anyOfIgnoreCase(crowdsourcers).toArray();
    const disputeCrowdsourcerCompletedLogs = await db.DisputeCrowdsourcerCompleted.where('disputeCrowdsourcer').anyOfIgnoreCase(crowdsourcers).toArray();
    const disputeCrowdsourcerCreatedLogsById = _.keyBy(disputeCrowdsourcerCreatedLogs, 'disputeCrowdsourcer');
    const disputeCrowdsourcerCompletedLogsById = _.keyBy(disputeCrowdsourcerCompletedLogs, 'disputeCrowdsourcer');

    const reportMarkets = _.map(unredeemedReports, 'market');
    const disputeMarkets = _.map(disputeCrowdsourcerTokens, 'market');
    const marketIds = _.uniq(_.concat(reportMarkets, disputeMarkets));
    const markets = await db.Markets.where('market').anyOfIgnoreCase(marketIds).toArray();
    const marketsById = _.keyBy(markets, 'market');

    const reportingContracts: ContractInfo[] = [];

    for (const report of unredeemedReports) {
      const market = marketsById[report.market];
      let isClaimable = false;
      if (market.reportingState === MarketReportingState.AwaitingFinalization || market.reportingState === MarketReportingState.Finalized) {
        // If the market is finalized/finalizable and this bond was correct its claimable, otherwise we leave it out entirely
        isClaimable = market.tentativeWinningPayoutNumerators.toString() === report.payoutNumerators.toString();
        if (!isClaimable) continue;
      }
      reportingContracts.push({
        address: report.initialReporter,
        amount: new BigNumber(report.amountStaked).toFixed(),
        marketId: report.market,
        isClaimable
      })
    }

    const reporting = {
      contracts: reportingContracts,
      totalStaked: reportingContracts.reduce((acc, item) => acc.plus(item.amount), new BigNumber(0)).toFixed(),
      totalClaimable: reportingContracts.reduce((acc, item) => acc.plus(item.isClaimable ? item.amount : 0), new BigNumber(0)).toFixed(),
    };

    const crowdsourcerContracts: ContractInfo[] = [];

    for (const crowdsourcer of disputeCrowdsourcerTokens) {
      const market = marketsById[crowdsourcer.market];
      const crowdsourcerCompleted = disputeCrowdsourcerCompletedLogsById[crowdsourcer.token];
      let isClaimable = false;
      if (market.reportingState === MarketReportingState.AwaitingFinalization || market.reportingState === MarketReportingState.Finalized) {
        // If the market is finalized/finalizable and this bond was correct its claimable, otherwise we leave it out entirely
        isClaimable = !crowdsourcerCompleted || crowdsourcerCompleted.payoutNumerators.toString() === market.tentativeWinningPayoutNumerators.toString();
        if (!isClaimable) continue;
      } else {
        // Unfinished bonds are always claimable
        isClaimable = !crowdsourcerCompleted && disputeCrowdsourcerCreatedLogsById[crowdsourcer.token].disputeRound < market.disputeRound;
      }
      crowdsourcerContracts.push({
        address: crowdsourcer.token,
        amount: new BigNumber(crowdsourcer.balance).toFixed(),
        marketId: crowdsourcer.market,
        isClaimable
      })
    }

    const disputing = {
      contracts: crowdsourcerContracts,
      totalStaked: crowdsourcerContracts.reduce((acc, item) => acc.plus(item.amount), new BigNumber(0)).toFixed(),
      totalClaimable: crowdsourcerContracts.reduce((acc, item) => acc.plus(item.isClaimable ? item.amount : 0), new BigNumber(0)).toFixed(),
    };

    // Get token balances of type ParticipationToken
    const participationTokens = await db.TokenBalanceChangedRollup.where('[universe+owner+tokenType]').equals([params.universe, params.account, 2]).and((log) => {
      return log.balance > '0x00';
    }).toArray();

    const universe = augur.getUniverse(params.universe);
    const curDisputeWindowAddress = await universe.getCurrentDisputeWindow_(false);

    // NOTE: We do not expect this to be a large list. In the standard/expected case this will be one item (maybe 2), so the cash balance & totalSupply calls are likely low impact
    const participationTokenContractInfo: ParticipationContract[] = [];

    for (const tokenBalanceLog of participationTokens) {
      const totalFees = await augur.contracts.cash.balanceOf_(tokenBalanceLog.token);
      const totalPTSupply = await augur.contracts.disputeWindowFromAddress(tokenBalanceLog.token).totalSupply_();
      const amount = new BigNumber(tokenBalanceLog.balance);
      const amountFees = amount.div(totalPTSupply).multipliedBy(totalFees);
      const isClaimable = tokenBalanceLog.token !== curDisputeWindowAddress;
      participationTokenContractInfo.push({
        address: tokenBalanceLog.token,
        amount: amount.toFixed(),
        amountFees: amountFees.toFixed(),
        isClaimable
      });
    };

    const participationTokensOverview: ParticipationOverview =  {
      contracts: participationTokenContractInfo,
      totalStaked: participationTokenContractInfo.reduce((acc, item) => acc.plus(item.amount), new BigNumber(0)).toFixed(),
      totalClaimable: participationTokenContractInfo.reduce((acc, item) => acc.plus(item.isClaimable ? item.amount : 0), new BigNumber(0)).toFixed(),
      totalFees: participationTokenContractInfo.reduce((acc, item) => acc.plus(item.amountFees), new BigNumber(0)).toFixed(),
    };

    const initialReportsRedeemed = await db.InitialReporterRedeemed.where('reporter').equals(params.account).and((log) => log.universe === params.universe && log.repReceived !== '0x00').toArray();
    const crowdsourcersRedeemed = await db.DisputeCrowdsourcerRedeemed.where('reporter').equals(params.account).and((log) => log.universe === params.universe && log.repReceived !== '0x00').toArray();
    const totalReportWinnings = initialReportsRedeemed.reduce((acc, item) => acc.plus(item.repReceived).minus(item.amountRedeemed), new BigNumber(0));
    const totalDisputeWinnings = crowdsourcersRedeemed.reduce((acc, item) => acc.plus(item.repReceived).minus(item.amountRedeemed), new BigNumber(0));
    const repWinnings = totalReportWinnings.plus(totalDisputeWinnings).toFixed();

    return  {
      repWinnings,
      reporting,
      disputing,
      participationTokens: participationTokensOverview,
    };
  }

  @Getter('getAccountTransactionHistoryParams')
  static async getAccountTransactionHistory<TBigNumber>(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Accounts.getAccountTransactionHistoryParams>
  ): Promise<AccountTransaction[]> {
    if (!params.earliestTransactionTime) params.earliestTransactionTime = 0;
    if (!params.latestTransactionTime) {
      params.latestTransactionTime = (await augur.contracts.augur.getTimestamp_()).toNumber();
    }
    if (!params.coin) params.coin = Coin.ALL;
    if (!params.action) params.action = Action.ALL;
    if (!params.sortBy) params.sortBy = 'timestamp';
    if (typeof params.isSortDescending === 'undefined') {
      params.isSortDescending = true;
    }

    let actionCoinComboIsValid = false;
    let allFormattedLogs: AccountTransaction[] = [];
    const formattedStartTime = `0x${params.earliestTransactionTime.toString(16)}`;
    const formattedEndTime = `0x${params.latestTransactionTime.toString(16)}`;
    if (
      (params.action === Action.FILLED ||
        params.action === Action.ALL) &&
      (params.coin === Coin.DAI || params.coin === Coin.ALL)
    ) {
      const orderLogs = await db.ParsedOrderEvent.where('timestamp').between(formattedStartTime, formattedEndTime, true, true).and((log) => {
        if (log.universe !== params.universe) return false;
        return log.orderCreator === params.account || log.orderFiller === params.account;
      }).toArray();
      const marketInfo = await Accounts.getMarketCreatedInfo(
        db,
        orderLogs
      );
      allFormattedLogs = allFormattedLogs.concat(
        formatOrderFilledLogs(orderLogs, marketInfo)
      );
      actionCoinComboIsValid = true;
    }

    if (
      (params.action === Action.OPEN || params.action === Action.ALL) &&
      (params.coin === Coin.DAI || params.coin === Coin.ALL)
    ) {
      const zeroXOpenOrders = await db.ZeroXOrders.where('orderCreator')
        .equals(params.account)
        .toArray();

      const marketIds: string[] = await zeroXOpenOrders.reduce(
        (ids, order) => Array.from(new Set([...ids, order.market])),
        []
      );
      const marketInfo = await Accounts.getMarketCreatedInfoByIds(
        db,
        marketIds
      );

      allFormattedLogs = allFormattedLogs.concat(
        formatZeroXOrders(zeroXOpenOrders, marketInfo)
      );
      actionCoinComboIsValid = true;
    }

    if (
      (params.action === Action.CANCEL || params.action === Action.ALL) &&
      (params.coin === Coin.DAI || params.coin === Coin.ALL)
    ) {

      const zeroXCanceledOrders = await db.CancelledOrders.where('[makerAddress+market]')
        .between([params.account, Dexie.minKey],[params.account, Dexie.maxKey])
        .toArray();

      const marketIds: string[] = await zeroXCanceledOrders.reduce(
        (ids, order) => Array.from(new Set([...ids, order.market])),
        []
      );

      const marketInfo = await Accounts.getMarketCreatedInfoByIds(
        db,
        marketIds
      );

      allFormattedLogs = allFormattedLogs.concat(
        formatZeroXCancelledOrders(zeroXCanceledOrders, marketInfo)
      );

      actionCoinComboIsValid = true;
    }

    if (
      (params.action === Action.CLAIM_PARTICIPATION_TOKENS ||
        params.action === Action.ALL) &&
      (params.coin === Coin.DAI || params.coin === Coin.REP || params.coin === Coin.ALL)
    ) {
      const participationTokensRedeemedLogs = await db.ParticipationTokensRedeemed.where('timestamp').between(formattedStartTime, formattedEndTime, true, true).and((log) => {
        return log.universe === params.universe && log.account === params.account;
      }).toArray();
      allFormattedLogs = allFormattedLogs.concat(
        formatParticipationTokensRedeemedLogs(participationTokensRedeemedLogs)
      );
      actionCoinComboIsValid = true;
    }

    if (
      (params.action === Action.CLAIM_TRADING_PROCEEDS ||
        params.action === Action.ALL) &&
      (params.coin === Coin.DAI || params.coin === Coin.ALL)
    ) {
      const tradingProceedsClaimedLogs = await db.TradingProceedsClaimed.where('timestamp').between(formattedStartTime, formattedEndTime, true, true).and((log) => {
        return log.universe === params.universe && log.sender === params.account;
      }).toArray();
      const marketInfo = await Accounts.getMarketCreatedInfo(
        db,
        tradingProceedsClaimedLogs
      );
      allFormattedLogs = allFormattedLogs.concat(
        await formatTradingProceedsClaimedLogs(
          tradingProceedsClaimedLogs,
          augur,
          marketInfo,
        )
      );
      actionCoinComboIsValid = true;
    }

    if (
      params.action === Action.CLAIM_WINNING_CROWDSOURCERS ||
      params.action === Action.ALL
    ) {
      const initialReporterRedeemedLogs = await db.InitialReporterRedeemed.where('timestamp').between(formattedStartTime, formattedEndTime, true, true).and((log) => {
        return log.universe === params.universe && log.reporter === params.account;
      }).toArray();
      let marketInfo = await Accounts.getMarketCreatedInfo(
        db,
        initialReporterRedeemedLogs
      );
      allFormattedLogs = allFormattedLogs.concat(
        await formatCrowdsourcerRedeemedLogs(
          initialReporterRedeemedLogs,
          marketInfo,
          params
        )
      );
      const disputeCrowdsourcerRedeemedLogs = await db.DisputeCrowdsourcerRedeemed.where('timestamp').between(formattedStartTime, formattedEndTime, true, true).and((log) => {
        return log.universe === params.universe && log.reporter === params.account;
      }).toArray();
      marketInfo = await Accounts.getMarketCreatedInfo(
        db,
        disputeCrowdsourcerRedeemedLogs
      );
      allFormattedLogs = allFormattedLogs.concat(
        await formatCrowdsourcerRedeemedLogs(
          disputeCrowdsourcerRedeemedLogs,
          marketInfo,
          params
        )
      );
      actionCoinComboIsValid = true;
    }

    if (
      (params.action === Action.MARKET_CREATION ||
        params.action === Action.ALL) &&
      (params.coin === Coin.DAI || params.coin === Coin.ALL)
    ) {
      const marketCreatedLogs = await db.MarketCreated.where('timestamp').between(formattedStartTime, formattedEndTime, true, true).and((log) => {
        return log.universe === params.universe && log.marketCreator === params.account;
      }).toArray();
      const marketInfo = formatMarketCreatedLogs(marketCreatedLogs);
      allFormattedLogs = allFormattedLogs.concat(marketInfo);
      actionCoinComboIsValid = true;
    }

    if (
      (params.action === Action.DISPUTE || params.action === Action.ALL) &&
      (params.coin === Coin.REP || params.coin === Coin.ALL)
    ) {
      const disputeCrowdsourcerContributionLogs = await db.DisputeCrowdsourcerContribution.where('timestamp').between(formattedStartTime, formattedEndTime, true, true).and((log) => {
        return log.universe === params.universe && log.reporter === params.account;
      }).toArray();
      const marketInfo = await Accounts.getMarketCreatedInfo(
        db,
        disputeCrowdsourcerContributionLogs
      );
      allFormattedLogs = allFormattedLogs.concat(
        await formatDisputeCrowdsourcerContributionLogs(
          disputeCrowdsourcerContributionLogs,
          augur,
          marketInfo
        )
      );
      actionCoinComboIsValid = true;
    }

    if (
      (params.action === Action.INITIAL_REPORT ||
        params.action === Action.ALL) &&
      (params.coin === Coin.REP || params.coin === Coin.ALL)
    ) {
      const initialReportSubmittedLogs = await db.InitialReportSubmitted.where('timestamp').between(formattedStartTime, formattedEndTime, true, true).and((log) => {
        return log.universe === params.universe && log.reporter === params.account;
      }).toArray();
      const marketInfo = await Accounts.getMarketCreatedInfo(
        db,
        initialReportSubmittedLogs
      );
      allFormattedLogs = allFormattedLogs.concat(
        await formatInitialReportSubmittedLogs(
          initialReportSubmittedLogs,
          augur,
          marketInfo
        )
      );
      actionCoinComboIsValid = true;
    }

    if (!actionCoinComboIsValid) {
      throw new Error('Invalid action/coin combination');
    }

    const order = params.isSortDescending ? 'desc' : 'asc';
    allFormattedLogs.sort(compareObjects(params.sortBy, order));

    if (params.limit == null && params.offset == null) return allFormattedLogs;

    const start = params.offset || 0;
    let end: number;
    if (params.limit) {
      if (params.offset) end = params.offset + params.limit;
      else end = params.limit;
    } else {
      end = allFormattedLogs.length;
    }
    return allFormattedLogs.slice(start, end);
  }

  @Getter('getUserCurrentDisputeStakeParams')
  static async getUserCurrentDisputeStake<TBigNumber>(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Accounts.getUserCurrentDisputeStakeParams>
  ): Promise<UserCurrentOutcomeDisputeStake[]> {
    const market = await db.Markets.get(params.marketId);
    const maxPrice = new BigNumber(market['prices'][1]);
    const minPrice = new BigNumber(market['prices'][0]);
    const numTicks = new BigNumber(market['numTicks']);
    const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
    const marketType = marketTypeToName(market.marketType);
    const displayMaxPrice = convertOnChainPriceToDisplayPrice(maxPrice, minPrice, tickSize).toString();
    const displayMinPrice = convertOnChainPriceToDisplayPrice(minPrice, minPrice, tickSize).toString();
    const contributions = await db.DisputeCrowdsourcerContribution.where('market').equals(params.marketId).and((log) => {
      return log.disputeRound === market.disputeRound && log.reporter === params.account;
    }).toArray();
    const contributionsByPayout = _.map(_.groupBy(contributions, 'disputeCrowdsourcer'), (disputeCrowdsourcerContributions) => {
      const firstContribution = disputeCrowdsourcerContributions[0];
      const payoutNumeratorsValue = calculatePayoutNumeratorsValue(
        displayMaxPrice,
        displayMinPrice,
        numTicks.toString(),
        marketType,
        firstContribution.payoutNumerators
      );
      const userStakeCurrent = _.reduce(disputeCrowdsourcerContributions, (sum, contribution) => {
        return sum.plus(contribution.amountStaked);
      }, new BigNumber(0));
      return {
        outcome: payoutNumeratorsValue.outcome,
        isInvalid: payoutNumeratorsValue.invalid,
        malformed: payoutNumeratorsValue.malformed,
        payoutNumerators: firstContribution.payoutNumerators.map((hex) => Number(hex).toString(10)),
        userStakeCurrent: userStakeCurrent.toFixed()
      }
    });
    return contributionsByPayout;
  }

  static async getMarketCreatedInfo<TBigNumber>(
    db: DB,
    transactionLogs: Array<
      | ParsedOrderEventLog
      | TradingProceedsClaimedLog
      | DisputeCrowdsourcerRedeemedLog
      | InitialReporterRedeemedLog
      | DisputeCrowdsourcerContributionLog
      | InitialReportSubmittedLog
      | CompleteSetsPurchasedLog
      | CompleteSetsSoldLog
    >
  ): Promise<MarketCreatedInfo> {
    const markets = transactionLogs.map(
      transactionLogs => transactionLogs.market
    );
    return Accounts.getMarketCreatedInfoByIds(db, markets);
  }

  static async getMarketCreatedInfoByIds<TBigNumber>(
    db: DB,
    marketIds: string[]
  ): Promise<MarketCreatedInfo> {
    const marketCreatedLogs = await db.Markets.where('market').anyOfIgnoreCase(marketIds).toArray();
    const marketCreatedInfo: MarketCreatedInfo = {};
    for (let i = 0; i < marketCreatedLogs.length; i++) {
      marketCreatedInfo[marketCreatedLogs[i].market] = marketCreatedLogs[i];
    }
    return marketCreatedInfo;
  }

}

function formatOrderFilledLogs(
  transactionLogs: ParsedOrderEventLog[],
  marketInfo: MarketCreatedInfo,
): AccountTransaction[] {
  return transactionLogs.map((transactionLog: ParsedOrderEventLog) => {
    const { amountFilled, orderType, fees, outcome, market, timestamp, transactionHash } = transactionLog;
    const onChainPrice = new BigNumber(transactionLog.price);
    const onChainQuantity = new BigNumber(amountFilled);
    const marketData = marketInfo[market];
    const maxPrice = new BigNumber(marketData.prices[1]);
    const minPrice = new BigNumber(marketData.prices[0]);
    const numTicks = new BigNumber(marketData.numTicks);
    const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
    const extraInfo = marketData.extraInfo;
    const quantity = convertOnChainAmountToDisplayAmount(onChainQuantity, tickSize);
    const price = convertOnChainPriceToDisplayPrice(onChainPrice, minPrice, tickSize);
    let outcomeDescription = describeMarketOutcome(outcome, marketData);
    if (marketData.marketType === MarketType.Scalar && outcomeDescription !== CommonOutcomes.Invalid) {
      outcomeDescription = extraInfo._scalarDenomination;
    }
    const total =
      orderType === OrderType.Bid
        ? convertAttoValueToDisplayValue(maxPrice).minus(price).times(quantity)
        : quantity.times(price);
    const orderTypeName = orderType === OrderType.Ask ? 'Buy' : 'Sell';
      return {
        action: orderTypeName,
        coin: Coin.DAI,
        details: orderTypeName,
        fee: convertAttoValueToDisplayValue(new BigNumber(fees)).toString(),
        marketDescription: extraInfo.description,
        outcome: new BigNumber(outcome).toNumber(),
        outcomeDescription,
        price: price.toString(),
        quantity: quantity.toString(),
        timestamp: new BigNumber(timestamp).toNumber(),
        total: total.toString(),
        transactionHash,
      };
  })
};


function formatZeroXOrders(
  storedOrders: StoredOrder[],
  marketInfo: MarketCreatedInfo
): AccountTransaction[] {
  return storedOrders.map(order => {
    const marketData = marketInfo[order.market];
    const maxPrice = new BigNumber(marketData.prices[1]);
    const minPrice = new BigNumber(marketData.prices[0]);
    const numTicks = new BigNumber(marketData.numTicks);
    const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
    const quantity = convertOnChainAmountToDisplayAmount(new BigNumber(order.amount), tickSize);
    const price = convertOnChainPriceToDisplayPrice(new BigNumber(order.price), minPrice, tickSize);
    const orderType = order.orderType === `0x0${OrderType.Bid}` ? 'Bid' : 'Ask';
    let outcomeDescription = describeMarketOutcome(order.outcome, marketData);
    if (marketData.marketType === MarketType.Scalar) {
      outcomeDescription = marketData.extraInfo._scalarDenomination;
    }
    return {
      action: `Open ${orderType}`,
      coin: Coin.DAI,
      details: `Open ${orderType}`,
      fee: '0',
      marketDescription: marketInfo[order.market].extraInfo.description,
      outcome: new BigNumber(order.outcome).toNumber(),
      outcomeDescription,
      price,
      quantity,
      // TODO: need to do something about timestamp, using salt as timestamp taking off last 4 numbers
      timestamp: new BigNumber(order.signedOrder.salt).dividedBy(1000).integerValue().toNumber(),
      total: '0',
      transactionHash: order.orderHash,
    };
  }) as unknown as AccountTransaction[];
}

function formatZeroXCancelledOrders(
  storedOrders: CancelledOrderLog[],
  marketInfo: MarketCreatedInfo
) {
  return storedOrders.map(order => {
    const marketData = marketInfo[order.market];
    const maxPrice = new BigNumber(marketData.prices[1]);
    const minPrice = new BigNumber(marketData.prices[0]);
    const numTicks = new BigNumber(marketData.numTicks);
    const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
    const onChainPrice = order.price;
    const quantity = 0;
    const price = convertOnChainPriceToDisplayPrice(new BigNumber(onChainPrice), minPrice, tickSize);
    const orderTypeName = order.orderType === `0x0${OrderType.Bid}` ? 'Bid' : 'Ask';
    const outcome = new BigNumber(order.outcome);
    let outcomeDescription = describeMarketOutcome(outcome.toNumber(), marketData);
    if (marketData.marketType === MarketType.Scalar) {
      outcomeDescription = marketData.extraInfo._scalarDenomination;
    }

    if (marketData.marketType === MarketType.Scalar) {
      outcomeDescription = marketData.extraInfo._scalarDenomination;
    }
    return {
      action: `Cancelled ${orderTypeName}`,
      coin: Coin.DAI,
      details: `Cancelled ${orderTypeName}`,
      fee: '0',
      marketDescription: marketInfo[order.market].extraInfo.description,
      outcome: 0, //new BigNumber(order.outcome).toNumber(),
      outcomeDescription,
      price,
      quantity,
      timestamp: 0, //new BigNumber(order.signedOrder.salt).dividedBy(1000).integerValue().toNumber(),
      total: '0',
      transactionHash: order.orderHash,
    };
  }) as unknown as AccountTransaction[];
}
function formatParticipationTokensRedeemedLogs(
  transactionLogs: ParticipationTokensRedeemedLog[]
): AccountTransaction[] {
  const formattedLogs: AccountTransaction[] = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    const { attoParticipationTokens, timestamp, feePayoutShare, transactionHash } = transactionLogs[i];

    formattedLogs.push({
      action: Action.CLAIM_PARTICIPATION_TOKENS,
      coin: Coin.DAI,
      details: 'Claimed reporting fees from participation tokens',
      fee: '0',
      marketDescription: '',
      outcome: null,
      outcomeDescription: null,
      price: '0',
      quantity: convertAttoValueToDisplayValue(new BigNumber(attoParticipationTokens)).toString(),
      timestamp: new BigNumber(timestamp).toNumber(),
      total: new BigNumber(feePayoutShare).toString(),
      transactionHash,
    });
  }
  return formattedLogs;
}

async function formatTradingProceedsClaimedLogs(
  transactionLogs: TradingProceedsClaimedLog[],
  augur: Augur,
  marketInfo: MarketCreatedInfo,
): Promise<AccountTransaction[]> {
  const formattedLogs: AccountTransaction[] = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    const transactionLog = transactionLogs[i];
    const { market, transactionHash, outcome, numShares, timestamp, numPayoutTokens, fees } = transactionLog;
    const marketData = marketInfo[market];
    const extraInfo = marketData.extraInfo;
    formattedLogs.push({
      action: Action.CLAIM_TRADING_PROCEEDS,
      coin: Coin.DAI,
      details: 'Claimed trading proceeds',
      fee: convertAttoValueToDisplayValue(new BigNumber(fees)).toString(),
      marketDescription: extraInfo.description,
      outcome: new BigNumber(outcome).toNumber(),
      outcomeDescription: describeMarketOutcome(outcome, marketData),
      price: new BigNumber(numPayoutTokens).div(numShares).toString(),
      quantity: convertAttoValueToDisplayValue(new BigNumber(numShares)).toString(),
      timestamp: new BigNumber(timestamp).toNumber(),
      total: convertAttoValueToDisplayValue(new BigNumber(numPayoutTokens)).toString(),
      transactionHash,
    });
  }
  return formattedLogs;
}

async function formatCrowdsourcerRedeemedLogs(
  transactionLogs:
    | InitialReporterRedeemedLog[]
    | DisputeCrowdsourcerRedeemedLog[],
  marketInfo: MarketCreatedInfo,
  params: t.TypeOf<typeof Accounts.getAccountTransactionHistoryParams>
): Promise<AccountTransaction[]> {
  const formattedLogs: AccountTransaction[] = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    const transactionLog = transactionLogs[i];
    const { market } = transactionLog;
    const marketData = marketInfo[market];
    const extraInfo = marketData.extraInfo;

    const payoutNumerators: BigNumber[] = [];
    for (
      let numeratorIndex = 0;
      numeratorIndex < transactionLog.payoutNumerators.length;
      numeratorIndex++
    ) {
      payoutNumerators.push(
        new BigNumber(transactionLog.payoutNumerators[numeratorIndex])
      );
    }
    const value = outcomeFromMarketLog(marketData, payoutNumerators);
    const outcome = Number(value.outcome);
    const outcomeDescription = describeUniverseOutcome(value, marketData);

    if (params.coin === 'REP' || params.coin === 'ALL') {
      formattedLogs.push({
        action: Action.CLAIM_WINNING_CROWDSOURCERS,
        coin: Coin.REP,
        details: 'Claimed REP fees from crowdsourcers',
        fee: '0',
        marketDescription: extraInfo.description || '',
        outcome,
        outcomeDescription,
        price: '0',
        quantity: '0',
        timestamp: new BigNumber(transactionLog.timestamp).toNumber(),
        total: new BigNumber(transactionLog.repReceived).toString(),
        transactionHash: transactionLog.transactionHash,
      });
    }
  }
  return formattedLogs;
}

function formatMarketCreatedLogs(
  transactionLogs: MarketCreatedLog[]
): AccountTransaction[] {
  const formattedLogs: AccountTransaction[] = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    const marketCreationLog = transactionLogs[i];
    const { timestamp, transactionHash } = marketCreationLog;
    const extraInfo = marketCreationLog.extraInfo ? JSON.parse(marketCreationLog.extraInfo) : {
      description: '',
    };

    formattedLogs.push({
      action: Action.MARKET_CREATION,
      coin: Coin.DAI,
      details: 'DAI validity bond for market creation',
      fee: '0',
      marketDescription: extraInfo.description,
      outcome: null,
      outcomeDescription: null,
      price: '0',
      quantity: '0',
      timestamp: new BigNumber(timestamp).toNumber(),
      total: '0',
      transactionHash,
    });
  }
  return formattedLogs;
}

async function formatDisputeCrowdsourcerContributionLogs(
  transactionLogs: DisputeCrowdsourcerContributionLog[],
  augur: Augur,
  marketInfo: MarketCreatedInfo
): Promise<AccountTransaction[]> {
  const formattedLogs: AccountTransaction[] = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    const transactionLog = transactionLogs[i];
    const { amountStaked, disputeCrowdsourcer, market, timestamp, transactionHash } = transactionLog;
    const marketData = marketInfo[market];
    const extraInfo = marketData.extraInfo;

    const reportingParticipant = augur.contracts.getReportingParticipant(disputeCrowdsourcer);
    const value = outcomeFromMarketLog(
      marketData,
      await reportingParticipant.getPayoutNumerators_()
    );

    formattedLogs.push({
      action: Action.DISPUTE,
      coin: Coin.REP,
      details: 'REP staked in dispute crowdsourcers',
      fee: '0',
      marketDescription: extraInfo.description,
      outcome: Number(value.outcome),
      outcomeDescription: describeUniverseOutcome(value, marketData),
      price: '0',
      quantity: convertAttoValueToDisplayValue(new BigNumber(amountStaked)).toString(),
      timestamp: new BigNumber(timestamp).toNumber(),
      total: '0',
      transactionHash,
    });
  }
  return formattedLogs;
}

async function formatInitialReportSubmittedLogs(
  transactionLogs: InitialReportSubmittedLog[],
  augur: Augur,
  marketInfo: MarketCreatedInfo
): Promise<AccountTransaction[]> {
  const formattedLogs: AccountTransaction[] = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    const transactionLog = transactionLogs[i];
    const { amountStaked, market, timestamp, transactionHash } = transactionLog;
    const marketData = marketInfo[market];
    const extraInfo = marketData.extraInfo;

    const reportingParticipantAddress = await augur.contracts
      .marketFromAddress(market)
      .getInitialReporter_();
    const reportingParticipant = augur.contracts.getReportingParticipant(
      reportingParticipantAddress
    );

    const value = outcomeFromMarketLog(
      marketData,
      await reportingParticipant.getPayoutNumerators_()
    );

    formattedLogs.push({
      action: Action.INITIAL_REPORT,
      coin: Coin.REP,
      details: 'REP staked in initial reports',
      fee: '0',
      marketDescription: extraInfo.description,
      outcome: Number(value.outcome),
      outcomeDescription: describeUniverseOutcome(value, marketData),
      price: '0',
      quantity: convertAttoValueToDisplayValue(new BigNumber(amountStaked)).toString(),
      timestamp: new BigNumber(timestamp).toNumber(),
      total: '0',
      transactionHash,
    });
  }
  return formattedLogs;
}

function outcomeFromMarketLog(market: MarketData, payoutNumerators: Array<BigNumber|string>): PayoutNumeratorValue {
  return calculatePayoutNumeratorsValue(
    convertOnChainAmountToDisplayAmount(new BigNumber(market.prices[1]), new BigNumber(market.numTicks)).toString(),
    convertOnChainAmountToDisplayAmount(new BigNumber(market.prices[0]), new BigNumber(market.numTicks)).toString(),
    new BigNumber(market.numTicks).toString(),
    marketTypeToName(market.marketType),
    payoutNumerators.map(String));
}

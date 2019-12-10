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
  OrderEventType,
  OrderType,
  ParsedOrderEventLog,
  ParticipationTokensRedeemedLog,
  TradingProceedsClaimedLog,
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
import { compareObjects, convertOnChainPriceToDisplayPrice, numTicksToTickSize } from '../../utils';
import * as _ from "lodash";
import * as t from 'io-ts';

export enum Action {
  ALL = 'ALL',
  BUY = 'BUY',
  SELL = 'SELL',
  CANCEL = 'CANCEL',
  CLAIM_PARTICIPATION_TOKENS = 'CLAIM_PARTICIPATION_TOKENS',
  CLAIM_TRADING_PROCEEDS = 'CLAIM_TRADING_PROCEEDS',
  CLAIM_WINNING_CROWDSOURCERS = 'CLAIM_WINNING_CROWDSOURCERS',
  DISPUTE = 'DISPUTE',
  INITIAL_REPORT = 'INITIAL_REPORT',
  MARKET_CREATION = 'MARKET_CREATION',
  COMPLETE_SETS = 'COMPLETE_SETS',
}

export enum Coin {
  ALL = 'ALL',
  ETH = 'ETH',
  REP = 'REP',
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
    const initialReportSubmittedLogs = await db.InitialReportSubmitted.where("reporter").equalsIgnoreCase(params.account).and((log) => log.universe === params.universe).toArray();
    const initialReportRedeemedLogs = await db.InitialReporterRedeemed.where("reporter").equalsIgnoreCase(params.account).and((log) => log.universe === params.universe).toArray();
    const redeemedReports = _.keyBy(initialReportRedeemedLogs, "market")
    const unredeemedReports = _.filter(initialReportSubmittedLogs, (initialReport) => { return !redeemedReports[initialReport.market] });

    // get token balance of crowdsourcers
    const disputeCrowdsourcerTokens = await db.TokenBalanceChanged.where("[universe+owner+tokenType]").equals([params.universe, params.account, 1]).and((log) => {
      return log.balance > "0x00";
    }).toArray();
    const crowdsourcers = _.uniq(_.map(disputeCrowdsourcerTokens, "token"));
    // get created and completed logs for these addresses
    const disputeCrowdsourcerCreatedLogs = await db.DisputeCrowdsourcerCreated.where("disputeCrowdsourcer").anyOfIgnoreCase(crowdsourcers).toArray();
    const disputeCrowdsourcerCompletedLogs = await db.DisputeCrowdsourcerCompleted.where("disputeCrowdsourcer").anyOfIgnoreCase(crowdsourcers).toArray();
    const disputeCrowdsourcerCreatedLogsById = _.keyBy(disputeCrowdsourcerCreatedLogs, "disputeCrowdsourcer");
    const disputeCrowdsourcerCompletedLogsById = _.keyBy(disputeCrowdsourcerCompletedLogs, "disputeCrowdsourcer");

    const reportMarkets = _.map(unredeemedReports, "market");
    const disputeMarkets = _.map(disputeCrowdsourcerTokens, "market");
    const marketIds = _.uniq(_.concat(reportMarkets, disputeMarkets));
    const markets = await db.Markets.where("market").anyOfIgnoreCase(marketIds).toArray();
    const marketsById = _.keyBy(markets, "market");

    const reportingContracts: ContractInfo[] = [];

    for (let report of unredeemedReports) {
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
    }

    const crowdsourcerContracts: ContractInfo[] = [];

    for (let crowdsourcer of disputeCrowdsourcerTokens) {
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
    }

    // Get token balances of type ParticipationToken
    const participationTokens = await db.TokenBalanceChanged.where("[universe+owner+tokenType]").equals([params.universe, params.account, 2]).and((log) => {
      return log.balance > "0x00";
    }).toArray();

    const universe = augur.getUniverse(params.universe);
    const curDisputeWindowAddress = await universe.getCurrentDisputeWindow_(false);

    // NOTE: We do not expect this to be a large list. In the standard/expected case this will be one item (maybe 2), so the cash balance & totalSupply calls are likely low impact
    const participationTokenContractInfo: ParticipationContract[] = [];

    for (let tokenBalanceLog of participationTokens) {
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

    const initialReportsRedeemed = await db.InitialReporterRedeemed.where("reporter").equals(params.account).and((log) => log.universe === params.universe && log.repReceived !== "0x00").toArray();
    const crowdsourcersRedeemed = await db.DisputeCrowdsourcerRedeemed.where("reporter").equals(params.account).and((log) => log.universe === params.universe && log.repReceived !== "0x00").toArray();
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
      (params.action === Action.BUY ||
        params.action === Action.SELL ||
        params.action === Action.ALL) &&
      (params.coin === Coin.ETH || params.coin === Coin.ALL)
    ) {
      const orderLogs = await db.OrderEvent.where('timestamp').between(formattedStartTime, formattedEndTime, true, true).and((log) => {
        if (log.universe !== params.universe) return false;
        return log.orderCreator === params.account || log.orderFiller === params.account;
      }).toArray();
      const marketInfo = await Accounts.getMarketCreatedInfo(
        db,
        orderLogs
      );
      allFormattedLogs = allFormattedLogs.concat(
        formatOrderFilledLogs(orderLogs, marketInfo, params)
      );
      actionCoinComboIsValid = true;
    }

    if (
      (params.action === Action.CANCEL || params.action === Action.ALL) &&
      (params.coin === Coin.ETH || params.coin === Coin.ALL)
    ) {
      const orderCanceledLogs = await db.OrderEvent.where('[universe+eventType+timestamp]').between([params.universe, OrderEventType.Cancel, formattedStartTime], [params.universe, OrderEventType.Cancel, formattedEndTime], true, true).and((log) => {
        return log.orderCreator === params.account;
      }).toArray();

      const marketInfo = await Accounts.getMarketCreatedInfo(
        db,
        orderCanceledLogs
      );
      allFormattedLogs = allFormattedLogs.concat(
        formatOrderCanceledLogs(orderCanceledLogs, marketInfo)
      );
      actionCoinComboIsValid = true;
    }

    if (
      (params.action === Action.CLAIM_PARTICIPATION_TOKENS ||
        params.action === Action.ALL) &&
      (params.coin === Coin.ETH || params.coin === Coin.ALL)
    ) {
      const participationTokensRedeemedLogs = await db.ParticipationTokensRedeemed.where("timestamp").between(formattedStartTime, formattedEndTime, true, true).and((log) => {
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
      (params.coin === Coin.ETH || params.coin === Coin.ALL)
    ) {
      const tradingProceedsClaimedLogs = await db.TradingProceedsClaimed.where("timestamp").between(formattedStartTime, formattedEndTime, true, true).and((log) => {
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
          db
        )
      );
      actionCoinComboIsValid = true;
    }

    if (
      params.action === Action.CLAIM_WINNING_CROWDSOURCERS ||
      params.action === Action.ALL
    ) {
      const initialReporterRedeemedLogs = await db.InitialReporterRedeemed.where("timestamp").between(formattedStartTime, formattedEndTime, true, true).and((log) => {
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
      const disputeCrowdsourcerRedeemedLogs = await db.DisputeCrowdsourcerRedeemed.where("timestamp").between(formattedStartTime, formattedEndTime, true, true).and((log) => {
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
      (params.coin === Coin.ETH || params.coin === Coin.ALL)
    ) {
      const marketCreatedLogs = await db.MarketCreated.where("timestamp").between(formattedStartTime, formattedEndTime, true, true).and((log) => {
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
      const disputeCrowdsourcerContributionLogs = await db.DisputeCrowdsourcerContribution.where("timestamp").between(formattedStartTime, formattedEndTime, true, true).and((log) => {
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
      const initialReportSubmittedLogs = await db.InitialReportSubmitted.where("timestamp").between(formattedStartTime, formattedEndTime, true, true).and((log) => {
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

    if (
      (params.action === Action.COMPLETE_SETS ||
        params.action === Action.ALL) &&
      (params.coin === Coin.ETH || params.coin === Coin.ALL)
    ) {
      const completeSetsPurchasedLogs = await db.CompleteSetsPurchased.where("timestamp").between(formattedStartTime, formattedEndTime, true, true).and((log) => {
        return log.universe === params.universe && log.account === params.account;
      }).toArray();
      let marketInfo = await Accounts.getMarketCreatedInfo(
        db,
        completeSetsPurchasedLogs
      );
      allFormattedLogs = allFormattedLogs.concat(
        formatCompleteSetsPurchasedLogs(completeSetsPurchasedLogs, marketInfo)
      );
      const completeSetsSoldLogs = await db.CompleteSetsSold.where("timestamp").between(formattedStartTime, formattedEndTime, true, true).and((log) => {
        return log.universe === params.universe && log.account === params.account;
      }).toArray();
      marketInfo = await Accounts.getMarketCreatedInfo(
        db,
        completeSetsSoldLogs
      );
      allFormattedLogs = allFormattedLogs.concat(
        formatCompleteSetsSoldLogs(completeSetsSoldLogs, marketInfo)
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
    const contributions = await db.DisputeCrowdsourcerContribution.where("market").equals(params.marketId).and((log) => {
      return log.disputeRound === market.disputeRound && log.reporter === params.account;
    }).toArray();
    const contributionsByPayout = _.map(_.groupBy(contributions, "disputeCrowdsourcer"), (disputeCrowdsourcerContributions) => {
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
    const marketCreatedLogs = await db.Markets.where("market").anyOfIgnoreCase(markets).toArray();
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
  params: t.TypeOf<typeof Accounts.getAccountTransactionHistoryParams>
): AccountTransaction[] {
  const formattedLogs: AccountTransaction[] = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    const transactionLog = transactionLogs[i];
    const { orderType, orderCreator, orderFiller, fees, outcome, market, timestamp, transactionHash } = transactionLog;
    const price = new BigNumber(transactionLog.price);
    const quantity = new BigNumber(transactionLog.amount);
    const maxPrice = new BigNumber(0);
    const marketData = marketInfo[market];
    const extraInfo = marketData.extraInfo;

    const outcomeDescription = describeMarketOutcome(outcome, marketData);

    if (
      (params.action === Action.BUY || params.action === Action.ALL) &&
      ((orderType === OrderType.Bid &&
        orderCreator === params.account) ||
        (orderType === OrderType.Ask &&
          orderFiller === params.account))
    ) {
      formattedLogs.push({
        action: Action.BUY,
        coin: Coin.ETH,
        details: 'Buy order',
        fee: new BigNumber(fees).toString(),
        marketDescription: extraInfo.description,
        outcome: new BigNumber(outcome).toNumber(),
        outcomeDescription,
        price: price.toString(),
        quantity: quantity.toString(),
        timestamp: new BigNumber(timestamp).toNumber(),
        total:
          orderType === OrderType.Bid
            ? quantity.times(maxPrice.minus(price)).toString()
            : quantity.times(price).toString(),
        transactionHash,
      });
    }
    if (
      (params.action === Action.SELL || params.action === Action.ALL) &&
      ((orderType === OrderType.Ask &&
        orderCreator === params.account) ||
        (orderType === OrderType.Bid &&
          orderFiller === params.account))
    ) {
      formattedLogs.push({
        action: Action.SELL,
        coin: Coin.ETH,
        details: 'Sell order',
        fee: new BigNumber(fees).toString(),
        marketDescription: extraInfo.description,
        outcome: new BigNumber(outcome).toNumber(),
        outcomeDescription,
        price: price.toString(),
        quantity: quantity.toString(),
        timestamp: new BigNumber(timestamp).toNumber(),
        total:
          orderType === OrderType.Bid
            ? quantity.times(maxPrice.minus(price)).toString()
            : quantity.times(price).toString(),
        transactionHash,
      });
    }
  }
  return formattedLogs;
}

function formatOrderCanceledLogs(
  transactionLogs: ParsedOrderEventLog[],
  marketInfo: MarketCreatedInfo
): AccountTransaction[] {
  const formattedLogs: AccountTransaction[] = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    const transactionLog = transactionLogs[i];
    const { market, transactionHash, timestamp, outcome, price, amount } = transactionLog;
    const marketData = marketInfo[market];
    const extraInfo = marketData.extraInfo;

    formattedLogs.push({
      action: Action.CANCEL,
      coin: Coin.ETH,
      details: 'Cancel order',
      fee: '0',
      marketDescription: extraInfo.description,
      outcome:  new BigNumber(outcome).toNumber(),
      outcomeDescription: describeMarketOutcome(outcome, marketData),
      price: new BigNumber(price).toString(),
      quantity: new BigNumber(amount).toString(),
      timestamp: new BigNumber(timestamp).toNumber(),
      total: '0',
      transactionHash,
    });
  }
  return formattedLogs;
}

function formatParticipationTokensRedeemedLogs(
  transactionLogs: ParticipationTokensRedeemedLog[]
): AccountTransaction[] {
  const formattedLogs: AccountTransaction[] = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    const { attoParticipationTokens, timestamp, feePayoutShare, transactionHash } = transactionLogs[i];

    formattedLogs.push({
      action: Action.CLAIM_PARTICIPATION_TOKENS,
      coin: Coin.ETH,
      details: 'Claimed reporting fees from participation tokens',
      fee: '0',
      marketDescription: '',
      outcome: null,
      outcomeDescription: null,
      price: '0',
      quantity: new BigNumber(attoParticipationTokens).toString(),
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
  db: DB
): Promise<AccountTransaction[]> {
  const formattedLogs: AccountTransaction[] = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    const transactionLog = transactionLogs[i];
    const { market, transactionHash, outcome, numShares, timestamp, numPayoutTokens, fees } = transactionLog;
    const marketData = marketInfo[market];
    const extraInfo = marketData.extraInfo;
    formattedLogs.push({
      action: Action.CLAIM_TRADING_PROCEEDS,
      coin: Coin.ETH,
      details: 'Claimed trading proceeds',
      fee: new BigNumber(fees).toFixed(),
      marketDescription: extraInfo.description,
      outcome: new BigNumber(outcome).toNumber(),
      outcomeDescription: describeMarketOutcome(outcome, marketData),
      price: new BigNumber(numPayoutTokens).div(numShares).toString(),
      quantity: new BigNumber(numShares).toString(),
      timestamp: new BigNumber(timestamp).toNumber(),
      total: new BigNumber(numPayoutTokens).toString(),
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

    if (params.coin === 'ETH' || params.coin === 'ALL') {
      formattedLogs.push({
        action: Action.CLAIM_WINNING_CROWDSOURCERS,
        coin: Coin.ETH,
        details: 'Claimed reporting fees from crowdsourcers',
        fee: '0',
        marketDescription: extraInfo.description || '',
        outcome,
        outcomeDescription,
        price: '0',
        quantity: '0',
        timestamp: new BigNumber(transactionLog.timestamp).toNumber(),
        total: new BigNumber(transactionLog.amountRedeemed).toString(),
        transactionHash: transactionLog.transactionHash,
      });
    }
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
      coin: Coin.ETH,
      details: 'ETH validity bond for market creation',
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
      quantity: new BigNumber(amountStaked).toString(),
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
      quantity: new BigNumber(amountStaked).toString(),
      timestamp: new BigNumber(timestamp).toNumber(),
      total: '0',
      transactionHash,
    });
  }
  return formattedLogs;
}

function formatCompleteSetsPurchasedLogs(
  transactionLogs: CompleteSetsPurchasedLog[],
  marketInfo: MarketCreatedInfo
): AccountTransaction[] {
  const formattedLogs: AccountTransaction[] = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    const transactionLog = transactionLogs[i];
    const { numCompleteSets, market, timestamp, transactionHash } = transactionLog;
    const marketData = marketInfo[market];
    const extraInfo = marketData.extraInfo;

    formattedLogs.push({
      action: Action.COMPLETE_SETS,
      coin: Coin.ETH,
      details: 'Buy complete sets',
      fee: '0',
      marketDescription: extraInfo.description,
      outcome: null,
      outcomeDescription: null,
      price: new BigNumber(marketData.numTicks).toString(),
      quantity: new BigNumber(numCompleteSets).toString(),
      timestamp: new BigNumber(timestamp).toNumber(),
      total: '0',
      transactionHash,
    });
  }
  return formattedLogs;
}

function formatCompleteSetsSoldLogs(
  transactionLogs: CompleteSetsSoldLog[],
  marketInfo: MarketCreatedInfo
): AccountTransaction[] {
  const formattedLogs: AccountTransaction[] = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    const transactionLog = transactionLogs[i];
    const { numCompleteSets, market, timestamp, transactionHash } = transactionLog;
    const marketData = marketInfo[market];
    const extraInfo = marketData.extraInfo;

    formattedLogs.push({
      action: Action.COMPLETE_SETS,
      coin: Coin.ETH,
      details: 'Sell complete sets',
      fee: '0',
      marketDescription: extraInfo.description,
      outcome: null,
      outcomeDescription: null,
      price: new BigNumber(marketData.numTicks).toString(),
      quantity: new BigNumber(numCompleteSets).toString(),
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

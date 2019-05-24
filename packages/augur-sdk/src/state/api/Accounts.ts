import { BigNumber } from "bignumber.js";
import { DB } from "../db/DB";
import { Getter } from "./Router";
import {
  CompleteSetsPurchasedLog,
  CompleteSetsSoldLog,
  DisputeCrowdsourcerContributionLog,
  DisputeCrowdsourcerRedeemedLog,
  InitialReporterRedeemedLog,
  InitialReportSubmittedLog,
  MarketCreatedLog,
  OrderEventAddressValue,
  ORDER_EVENT_CREATOR,
  ORDER_EVENT_FILLER,
  OrderEventLog,
  OrderEventUint256Value,
  ParticipationTokensRedeemedLog,
  TradingProceedsClaimedLog,
  OrderType,
  MarketType
} from "../logs/types";
import { SortLimit } from "./types";
import { Augur } from "../../index";
import { ethers } from "ethers";
import { toAscii } from "../utils/utils";

import * as t from "io-ts";

export enum Action {
  ALL = "ALL",
  BUY = "BUY",
  SELL = "SELL",
  CANCEL = "CANCEL",
  CLAIM_PARTICIPATION_TOKENS = "CLAIM_PARTICIPATION_TOKENS",
  CLAIM_TRADING_PROCEEDS = "CLAIM_TRADING_PROCEEDS",
  CLAIM_WINNING_CROWDSOURCERS = "CLAIM_WINNING_CROWDSOURCERS",
  DISPUTE = "DISPUTE",
  INITIAL_REPORT = "INITIAL_REPORT",
  MARKET_CREATION = "MARKET_CREATION",
  COMPLETE_SETS  = "COMPLETE_SETS"
};

export enum Coin {
  ALL = "ALL",
  ETH = "ETH",
  REP = "REP"
};

export const KeyOfAction = t.keyof(Action);
export const KeyOfCoin = t.keyof(Coin);

const GetAccountTransactionHistoryParamsSpecific = t.type({
  universe: t.string,
  account: t.string,
  earliestTransactionTime: t.union([t.number, t.null, t.undefined]),
  latestTransactionTime: t.union([t.number, t.null, t.undefined]),
  coin: t.union([KeyOfCoin, t.null, t.undefined]),
  action: t.union([KeyOfAction, t.null, t.undefined])
});

export interface AccountTransaction {
  action: string;
  coin: string;
  details: string;
  fee: string;
  marketDescription: string;
  outcome: number|null;
  outcomeDescription: string|null;
  price: string;
  quantity: string;
  timestamp: number;
  total: string;
  transactionHash: string;
};

export interface MarketCreatedInfo {
  [key: string]: MarketCreatedLog;
}

export class Accounts<TBigNumber> {
  public static GetAccountTransactionHistoryParams = t.intersection([GetAccountTransactionHistoryParamsSpecific, SortLimit]);

  @Getter("GetAccountTransactionHistoryParams")
  public static async getAccountTransactionHistory<TBigNumber>(augur: Augur, db: DB, params: t.TypeOf<typeof Accounts.GetAccountTransactionHistoryParams>): Promise<Array<AccountTransaction>> {
    if (!params.earliestTransactionTime) params.earliestTransactionTime = 0;
    if (!params.latestTransactionTime) params.latestTransactionTime = Math.floor(Date.now() / 1000);
    if (!params.coin) params.coin = Coin.ALL;
    if (!params.action) params.action = Action.ALL;

    let actionCoinComboIsValid = false;
    let allFormattedLogs: any = [];
    if ((params.action === Action.BUY || params.action === Action.SELL || params.action === Action.ALL) && (params.coin === Coin.ETH || params.coin === Coin.ALL)) {
      const orderFilledLogs = await db.findOrderFilledLogs({selector: {universe: params.universe, $or: [{[ORDER_EVENT_CREATOR]: params.account}, {[ORDER_EVENT_FILLER]: params.account}]}});
      const marketInfo = await Accounts.getMarketCreatedInfo(db, orderFilledLogs);
      allFormattedLogs = allFormattedLogs.concat(formatOrderFilledLogs(orderFilledLogs, marketInfo, params));
      actionCoinComboIsValid = true;
    }

    if ((params.action === Action.CANCEL || params.action === Action.ALL) && (params.coin === Coin.ETH || params.coin === Coin.ALL)) {
      const orderCanceledLogs = await db.findOrderCanceledLogs({selector: {universe: params.universe}});
      const marketInfo = await Accounts.getMarketCreatedInfo(db, orderCanceledLogs);
      allFormattedLogs = allFormattedLogs.concat(formatOrderCanceledLogs(orderCanceledLogs, marketInfo, params));
      actionCoinComboIsValid = true;
    }

    if ((params.action === Action.CLAIM_PARTICIPATION_TOKENS || params.action === Action.ALL) && (params.coin === Coin.ETH || params.coin === Coin.ALL)) {
      const participationTokensRedeemedLogs = await db.findParticipationTokensRedeemedLogs({selector: {universe: params.universe, account: params.account}});
      allFormattedLogs = allFormattedLogs.concat(formatParticipationTokensRedeemedLogs(participationTokensRedeemedLogs, params));
      actionCoinComboIsValid = true;
    }

    if ((params.action === Action.CLAIM_TRADING_PROCEEDS || params.action === Action.ALL) && (params.coin === Coin.ETH || params.coin === Coin.ALL)) {
      const tradingProceedsClaimedLogs = await db.findTradingProceedsClaimedLogs({selector: {universe: params.universe, sender: params.account}});
      const marketInfo = await Accounts.getMarketCreatedInfo(db, tradingProceedsClaimedLogs);
      allFormattedLogs = allFormattedLogs.concat(formatTradingProceedsClaimedLogs(tradingProceedsClaimedLogs, marketInfo, params));
      actionCoinComboIsValid = true;
    }

    if (params.action === Action.CLAIM_WINNING_CROWDSOURCERS || params.action === Action.ALL) {
      const disputeCrowdsourcerRedeemedLogs = await db.findDisputeCrowdsourcerRedeemedLogs({selector: {universe: params.universe, reporter: params.account}});
      let marketInfo = await Accounts.getMarketCreatedInfo(db, disputeCrowdsourcerRedeemedLogs);
      allFormattedLogs = allFormattedLogs.concat(await formatCrowdsourcerRedeemedLogs(disputeCrowdsourcerRedeemedLogs, augur, marketInfo, params));
      const initialReporterRedeemedLogs = await db.findInitialReporterRedeemedLogs({selector: {universe: params.universe, reporter: params.account}});
      marketInfo = await Accounts.getMarketCreatedInfo(db, initialReporterRedeemedLogs);
      allFormattedLogs = allFormattedLogs.concat(formatCrowdsourcerRedeemedLogs(initialReporterRedeemedLogs, augur, marketInfo, params));
      actionCoinComboIsValid = true;
    }

    if ((params.action === Action.MARKET_CREATION || params.action === Action.ALL) && (params.coin === Coin.ETH || params.coin === Coin.ALL)) {
      const marketCreatedLogs = await db.findMarketCreatedLogs({selector: {universe: params.universe, marketCreator: params.account}});
      const asdf = formatMarketCreatedLogs(marketCreatedLogs, params);
      allFormattedLogs = allFormattedLogs.concat(asdf);
      actionCoinComboIsValid = true;
    }

    if ((params.action === Action.DISPUTE || params.action === Action.ALL) && (params.coin === Coin.REP || params.coin === Coin.ALL)) {
      const disputeCrowdsourcerContributionLogs = await db.findDisputeCrowdsourcerContributionLogs({selector: {universe: params.universe, reporter: params.account}});
      const marketInfo = await Accounts.getMarketCreatedInfo(db, disputeCrowdsourcerContributionLogs);
      allFormattedLogs = allFormattedLogs.concat(await formatDisputeCrowdsourcerContributionLogs(disputeCrowdsourcerContributionLogs, augur, marketInfo, params));
      actionCoinComboIsValid = true;
    }

    if ((params.action === Action.INITIAL_REPORT || params.action === Action.ALL) && (params.coin === Coin.REP || params.coin === Coin.ALL)) {
      const initialReportSubmittedLogs = await db.findInitialReportSubmittedLogs({selector: {universe: params.universe, reporter: params.account}});
      const marketInfo = await Accounts.getMarketCreatedInfo(db, initialReportSubmittedLogs);
      allFormattedLogs = allFormattedLogs.concat(await formatInitialReportSubmittedLogs(initialReportSubmittedLogs, augur, marketInfo, params));
      actionCoinComboIsValid = true;
    }

    if ((params.action === Action.COMPLETE_SETS || params.action === Action.ALL) && (params.coin === Coin.ETH || params.coin === Coin.ALL)) {
      const completeSetsPurchasedLogs = await db.findCompleteSetsPurchasedLogs({selector: {universe: params.universe, account: params.account}});
      let marketInfo = await Accounts.getMarketCreatedInfo(db, completeSetsPurchasedLogs);
      allFormattedLogs = allFormattedLogs.concat(formatCompleteSetsPurchasedLogs(completeSetsPurchasedLogs, marketInfo, params));
      const completeSetsSoldLogs = await db.findCompleteSetsSoldLogs({selector: {universe: params.universe, account: params.account}});
      marketInfo = await Accounts.getMarketCreatedInfo(db, completeSetsSoldLogs);
      allFormattedLogs = allFormattedLogs.concat(formatCompleteSetsSoldLogs(completeSetsSoldLogs, marketInfo, params));
      actionCoinComboIsValid = true;
    }

    // TODO Filter logs by earliestTransactionTime & latestTransactionTime

    if (!actionCoinComboIsValid) {
      throw new Error("Invalid action/coin combination");
    }

    // TODO Sort/limit results by implementing sortBy, isSortDescending, limit, & offset

    return allFormattedLogs;
  }

  static async getMarketCreatedInfo<TBigNumber>(db: DB, transactionLogs: Array<OrderEventLog|TradingProceedsClaimedLog|DisputeCrowdsourcerRedeemedLog|InitialReporterRedeemedLog|DisputeCrowdsourcerContributionLog|InitialReportSubmittedLog|CompleteSetsPurchasedLog|CompleteSetsSoldLog>): Promise<MarketCreatedInfo> {
    const markets = transactionLogs.map(transactionLogs => transactionLogs.market);
    let marketCreatedLogs = await db.findMarketCreatedLogs({selector: {market: {$in: markets}}});
    const marketCreatedInfo: MarketCreatedInfo = {};
    for (let i = 0; i < marketCreatedLogs.length; i++) {
      marketCreatedInfo[marketCreatedLogs[i].market] = marketCreatedLogs[i];
    }
    return marketCreatedInfo;
  }
}

function getOutcomeDescriptionFromOutcome(outcome: number, market: MarketCreatedLog): string {
  if (market.marketType === MarketType.YesNo) {
    if (outcome === 0) {
      return "Invalid";
    } else if (outcome === 1) {
      return "No";
    } else {
      return "Yes";
    }
  } else if (market.marketType === MarketType.Scalar) {
    if (outcome === 0) {
      return "Invalid"
    } else if (outcome === 1) {
      return new BigNumber(market.prices[0]).toString(10);
    } else {
      return new BigNumber(market.prices[1]).toString(10);
    }
  } else {
    return toAscii(market.outcomes[new BigNumber(outcome).toNumber()]);
  }
}

function getOutcomeFromPayoutNumerators(payoutNumerators: Array<BigNumber>, market: MarketCreatedLog): number {
  let outcome = 0;
  for (; outcome < payoutNumerators.length; outcome++) {
    if (payoutNumerators[outcome].toNumber() > 0) {
      break;
    }
  }
  return outcome;
}

function formatOrderFilledLogs(transactionLogs: Array<OrderEventLog>, marketInfo: MarketCreatedInfo, params: t.TypeOf<typeof Accounts.GetAccountTransactionHistoryParams>): Array<AccountTransaction> {
  let formattedLogs: Array<AccountTransaction> = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    const price = new BigNumber(transactionLogs[i].uint256Data[OrderEventUint256Value.price]);
    const quantity = new BigNumber(transactionLogs[i].uint256Data[OrderEventUint256Value.amount]);
    const maxPrice = new BigNumber(0);
    if (
      (params.action === Action.BUY || params.action === Action.ALL) &&
      ((transactionLogs[i].orderType === OrderType.Bid && transactionLogs[i].addressData[OrderEventAddressValue.orderCreator] == params.account) ||
      (transactionLogs[i].orderType === OrderType.Ask && transactionLogs[i].addressData[OrderEventAddressValue.orderFiller] == params.account))
    )  {
      formattedLogs.push(
        {
          action: Action.BUY,
          coin: Coin.ETH,
          details: "Buy order",
          fee: "", // TODO reporterFees + marketCreatorFees
          marketDescription: marketInfo[transactionLogs[i].market].extraInfo && JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description ? JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description : "",
          outcome: new BigNumber(transactionLogs[i].uint256Data[OrderEventUint256Value.outcome]).toNumber(),
          outcomeDescription: getOutcomeDescriptionFromOutcome(new BigNumber(transactionLogs[i].uint256Data[OrderEventUint256Value.outcome]).toNumber(), marketInfo[transactionLogs[i].market]),
          price: price.toString(),
          quantity: quantity.toString(),
          timestamp: new BigNumber(transactionLogs[i].uint256Data[OrderEventUint256Value.timestamp]).toNumber(),
          total: transactionLogs[i].orderType === OrderType.Bid ? quantity.times(maxPrice.minus(price)).toString() : quantity.times(price).toString(),
          transactionHash: transactionLogs[i].transactionHash,
        }
      );
    }
    if (
      (params.action === Action.SELL || params.action === Action.ALL) &&
      ((transactionLogs[i].orderType === OrderType.Ask && transactionLogs[i].addressData[OrderEventAddressValue.orderCreator] == params.account) ||
      (transactionLogs[i].orderType === OrderType.Bid && transactionLogs[i].addressData[OrderEventAddressValue.orderFiller] == params.account))
    )  {
      formattedLogs.push(
        {
          action: Action.SELL,
          coin: Coin.ETH,
          details: "Sell order",
          fee: "", // TODO reporterFees + marketCreatorFees
          marketDescription: marketInfo[transactionLogs[i].market].extraInfo && JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description ? JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description : "",
          outcome: new BigNumber(transactionLogs[i].uint256Data[OrderEventUint256Value.outcome]).toNumber(),
          outcomeDescription: getOutcomeDescriptionFromOutcome(new BigNumber(transactionLogs[i].uint256Data[OrderEventUint256Value.outcome]).toNumber(), marketInfo[transactionLogs[i].market]),
          price: price.toString(),
          quantity: quantity.toString(),
          timestamp: new BigNumber(transactionLogs[i].uint256Data[OrderEventUint256Value.timestamp]).toNumber(),
          total: transactionLogs[i].orderType === OrderType.Bid ? quantity.times(maxPrice.minus(price)).toString() : quantity.times(price).toString(),
          transactionHash: transactionLogs[i].transactionHash,
        }
      );
    }
  }
  return formattedLogs;
}

function formatOrderCanceledLogs(transactionLogs: Array<OrderEventLog>, marketInfo: MarketCreatedInfo, params: t.TypeOf<typeof Accounts.GetAccountTransactionHistoryParams>): Array<AccountTransaction> {
  let formattedLogs: Array<AccountTransaction> = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    formattedLogs.push(
      {
        action: Action.CANCEL,
        coin: Coin.ETH,
        details: "Cancel order",
        fee: "0",
        marketDescription: marketInfo[transactionLogs[i].market].extraInfo && JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description ? JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description : "",
        outcome: new BigNumber(transactionLogs[i].uint256Data[OrderEventUint256Value.outcome]).toNumber(),
        outcomeDescription: getOutcomeDescriptionFromOutcome(new BigNumber(transactionLogs[i].uint256Data[OrderEventUint256Value.outcome]).toNumber(), marketInfo[transactionLogs[i].market]),
        price: transactionLogs[i].uint256Data[OrderEventUint256Value.price],
        quantity: transactionLogs[i].uint256Data[OrderEventUint256Value.amount],
        timestamp: new BigNumber(transactionLogs[i].uint256Data[OrderEventUint256Value.timestamp]).toNumber(),
        total: "0",
        transactionHash: transactionLogs[i].transactionHash,
      }
    );
  }
  return formattedLogs;
}

function formatParticipationTokensRedeemedLogs(transactionLogs: Array<ParticipationTokensRedeemedLog>, params: t.TypeOf<typeof Accounts.GetAccountTransactionHistoryParams>): Array<AccountTransaction> {
  let formattedLogs: Array<AccountTransaction> = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    formattedLogs.push(
      {
        action: Action.CLAIM_PARTICIPATION_TOKENS,
        coin: Coin.ETH,
        details: "Claimed reporting fees from participation tokens",
        fee: "0",
        marketDescription: "",
        outcome: null,
        outcomeDescription: null,
        price: "0",
        quantity: transactionLogs[i].attoParticipationTokens,
        timestamp: 0, // TODO?
        total: transactionLogs[i].feePayoutShare,
        transactionHash: transactionLogs[i].transactionHash,
      }
    );
  }
  return formattedLogs;
}

function formatTradingProceedsClaimedLogs(transactionLogs: Array<TradingProceedsClaimedLog>, marketInfo: MarketCreatedInfo, params: t.TypeOf<typeof Accounts.GetAccountTransactionHistoryParams>): Array<AccountTransaction> {
  let formattedLogs: Array<AccountTransaction> = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    const price = 0; // TODO: look up outcome price
    formattedLogs.push(
      {
        action: Action.CLAIM_TRADING_PROCEEDS,
        coin: Coin.ETH,
        details: "Claimed trading proceeds",
        fee: (new BigNumber(transactionLogs[i].numShares).times(price)).minus(transactionLogs[i].numPayoutTokens).toString(),
        marketDescription: marketInfo[transactionLogs[i].market].extraInfo && JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description ? JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description : "",
        outcome: null, // TODO: look up market
        outcomeDescription: null, // TODO: look up market
        price: price.toString(),
        quantity: transactionLogs[i].numShares,
        timestamp: 0, // TODO?
        total: transactionLogs[i].numPayoutTokens.toString(),
        transactionHash: transactionLogs[i].transactionHash,
      }
    );
  }
  return formattedLogs;
}

async function formatCrowdsourcerRedeemedLogs(transactionLogs: Array<DisputeCrowdsourcerRedeemedLog>|Array<InitialReporterRedeemedLog>, augur: Augur, marketInfo: MarketCreatedInfo, params: t.TypeOf<typeof Accounts.GetAccountTransactionHistoryParams>): Promise<Array<AccountTransaction>> {
  let formattedLogs: Array<AccountTransaction> = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    const reportingParticipant = augur.contracts.getReportingParticipant(transactionLogs[i].reporter);
    const outcome = getOutcomeFromPayoutNumerators(await reportingParticipant.getPayoutNumerators_(), marketInfo[transactionLogs[i].market]);
    const outcomeDescription = getOutcomeDescriptionFromOutcome(outcome, marketInfo[transactionLogs[i].market]);
    if (params.coin === "ETH" || params.coin === "ALL") {
      formattedLogs.push(
        {
          action: Action.CLAIM_WINNING_CROWDSOURCERS,
          coin: Coin.ETH,
          details: "Claimed reporting fees from crowdsourcers",
          fee: "0",
          marketDescription: marketInfo[transactionLogs[i].market].extraInfo && JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description ? JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description : "",
          outcome,
          outcomeDescription,
          price: "0",
          quantity: "0",
          timestamp: 0, // TODO?
          total: transactionLogs[i].amountRedeemed,
          transactionHash: transactionLogs[i].transactionHash,
        }
      );
    }
    if (params.coin === "REP" || params.coin === "ALL") {
      formattedLogs.push(
        {
          action: Action.CLAIM_WINNING_CROWDSOURCERS,
          coin: Coin.REP,
          details: "Claimed REP fees from crowdsourcers",
          fee: "0",
          marketDescription: marketInfo[transactionLogs[i].market].extraInfo && JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description ? JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description : "",
          outcome,
          outcomeDescription,
          price: "0",
          quantity: "0",
          timestamp: 0, // TODO?
          total: transactionLogs[i].repReceived,
          transactionHash: transactionLogs[i].transactionHash,
        }
      );
    }
  }
  return formattedLogs;
}

function formatMarketCreatedLogs(transactionLogs: MarketCreatedLog[], params: t.TypeOf<typeof Accounts.GetAccountTransactionHistoryParams>): Array<AccountTransaction> {
  let formattedLogs: Array<AccountTransaction> = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    formattedLogs.push(
      {
        action: Action.MARKET_CREATION,
        coin: Coin.ETH,
        details: "ETH validity bond for market creation",
        fee: "", // TODO?
        marketDescription: transactionLogs[i].extraInfo && JSON.parse(transactionLogs[i].extraInfo).description ? JSON.parse(transactionLogs[i].extraInfo).description : "",
        outcome: null,
        outcomeDescription: null,
        price: "0",
        quantity: "0",
        timestamp: 0, // TODO?
        total: "0",
        transactionHash: transactionLogs[i].transactionHash,
      }
    );
  }
  return formattedLogs;
}

async function formatDisputeCrowdsourcerContributionLogs(transactionLogs: Array<DisputeCrowdsourcerContributionLog>, augur: Augur, marketInfo: MarketCreatedInfo, params: t.TypeOf<typeof Accounts.GetAccountTransactionHistoryParams>): Promise<Array<AccountTransaction>> {
  let formattedLogs: Array<AccountTransaction> = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    const reportingParticipant = augur.contracts.getReportingParticipant(transactionLogs[i].reporter);
    const outcome = getOutcomeFromPayoutNumerators(await reportingParticipant.getPayoutNumerators_(), marketInfo[transactionLogs[i].market]);
    const outcomeDescription = getOutcomeDescriptionFromOutcome(outcome, marketInfo[transactionLogs[i].market]);
    formattedLogs.push(
      {
        action: Action.DISPUTE,
        coin: Coin.REP,
        details: "REP staked in dispute crowdsourcers",
        fee: "0",
        marketDescription: marketInfo[transactionLogs[i].market].extraInfo && JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description ? JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description : "",
        outcome,
        outcomeDescription,
        price: "0",
        quantity: transactionLogs[i].amountStaked,
        timestamp: 0, // TODO?
        total: "0",
        transactionHash: transactionLogs[i].transactionHash,
      }
    );
  }
  return formattedLogs;
}

async function formatInitialReportSubmittedLogs(transactionLogs: Array<InitialReportSubmittedLog>, augur: Augur, marketInfo: MarketCreatedInfo, params: t.TypeOf<typeof Accounts.GetAccountTransactionHistoryParams>): Promise<Array<AccountTransaction>> {
  let formattedLogs: Array<AccountTransaction> = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    const reportingParticipant = augur.contracts.getReportingParticipant(transactionLogs[i].reporter);
    const outcome = getOutcomeFromPayoutNumerators(await reportingParticipant.getPayoutNumerators_(), marketInfo[transactionLogs[i].market]);
    const outcomeDescription = getOutcomeDescriptionFromOutcome(outcome, marketInfo[transactionLogs[i].market]);
    formattedLogs.push(
      {
        action: Action.INITIAL_REPORT,
        coin: Coin.REP,
        details: "REP staked in initial reports",
        fee: "0",
        marketDescription: marketInfo[transactionLogs[i].market].extraInfo && JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description ? JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description : "",
        outcome,
        outcomeDescription,
        price: "0",
        quantity: transactionLogs[i].amountStaked,
        timestamp: 0, // TODO?
        total: "0",
        transactionHash: transactionLogs[i].transactionHash,
      }
    );
  }
  return formattedLogs;
}

function formatCompleteSetsPurchasedLogs(transactionLogs: Array<CompleteSetsPurchasedLog>, marketInfo: MarketCreatedInfo, params: t.TypeOf<typeof Accounts.GetAccountTransactionHistoryParams>): Array<AccountTransaction> {
  let formattedLogs: Array<AccountTransaction> = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    formattedLogs.push(
      {
        action: Action.COMPLETE_SETS,
        coin: Coin.ETH,
        details: "Buy complete sets",
        fee: "0",
        marketDescription: marketInfo[transactionLogs[i].market].extraInfo && JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description ? JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description : "",
        outcome: null,
        outcomeDescription: null,
        price: marketInfo[transactionLogs[i].market].numTicks,
        quantity: transactionLogs[i].numCompleteSets,
        timestamp: 0, // TODO?
        total: "0",
        transactionHash: transactionLogs[i].transactionHash,
      }
    );
  }
  return formattedLogs;
}

function formatCompleteSetsSoldLogs(transactionLogs: Array<CompleteSetsSoldLog>, marketInfo: MarketCreatedInfo, params: t.TypeOf<typeof Accounts.GetAccountTransactionHistoryParams>): Array<AccountTransaction> {
  let formattedLogs: Array<AccountTransaction> = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    formattedLogs.push(
      {
        action: Action.COMPLETE_SETS,
        coin: Coin.ETH,
        details: "Sell complete sets",
        fee: "0",
        marketDescription: marketInfo[transactionLogs[i].market].extraInfo && JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description ? JSON.parse(marketInfo[transactionLogs[i].market].extraInfo).description : "",
        outcome: null,
        outcomeDescription: null,
        price: marketInfo[transactionLogs[i].market].numTicks,
        quantity: transactionLogs[i].numCompleteSets,
        timestamp: 0, // TODO?
        total: "0",
        transactionHash: transactionLogs[i].transactionHash,
      }
    );
  }
  return formattedLogs;
}

import { BigNumber } from "bignumber.js";
import { DB } from "../db/DB";
import { Getter } from "./Router";
import {
  CompleteSetsPurchasedLog,
  CompleteSetsSoldLog,
  DisputeCrowdsourcerRedeemedLog,
  InitialReporterRedeemedLog,
  MarketCreatedLog,
  OrderEventLog,
  ParticipationTokensRedeemedLog,
  TradingProceedsClaimedLog
} from "../logs/types";
import { SortLimit } from "./types";
import { Augur } from "../../index";
import { ethers } from "ethers";

import * as t from "io-ts";

export enum Action {
  ALL = "ALL",
  BUY = "BUY",
  SELL = "SELL",
  CANCEL = "CANCEL",
  CLAIM_MARKET_CREATOR_FEES = "CLAIM_MARKET_CREATOR_FEES",
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
  outcome: number;
  outcomeDescription: string;
  price: string;
  quantity: string;
  timestamp: number;
  total: string;
  transactionHash: string;
};

export class Accounts<TBigNumber> {
  public static GetAccountTransactionHistoryParams = t.intersection([GetAccountTransactionHistoryParamsSpecific, SortLimit]);

  @Getter("GetAccountTransactionHistoryParams")
  public static async getAccountTransactionHistory<TBigNumber>(augur: Augur<ethers.utils.BigNumber>, db: DB<TBigNumber>, params: t.TypeOf<typeof Accounts.GetAccountTransactionHistoryParams>): Promise<Array<AccountTransaction>> {
    if (!params.earliestTransactionTime) params.earliestTransactionTime = 0;
    if (!params.latestTransactionTime) params.latestTransactionTime = Math.floor(Date.now() / 1000);
    if (!params.coin) params.coin = Coin.ALL;
    if (!params.action) params.action = Action.ALL;

    // TODO Check for coin/action compatibility

    const marketCreatedLogs = await db.findMarketCreatedLogs({selector: {universe: params.universe}});
    const orderCreatedLogs = await db.findOrderCreatedLogs({selector: {universe: params.universe}});
    const orderFilledLogs = await db.findOrderFilledLogs({selector: {universe: params.universe}});
    const orderCanceledLogs = await db.findOrderCanceledLogs({selector: {universe: params.universe}});
    const completeSetsPurchasedLogs = await db.findCompleteSetsPurchasedLogs({selector: {universe: params.universe}});
    const completeSetsSoldLogs = await db.findCompleteSetsSoldLogs({selector: {universe: params.universe}});
    const participationTokensRedeemedLogs = await db.findParticipationTokensRedeemedLogs({selector: {universe: params.universe}});
    const tradingProceedsClaimedLogs = await db.findTradingProceedsClaimedLogs({selector: {universe: params.universe}});
    const disputeCrowdsourcerRedeemedLogs = await db.findDisputeCrowdsourcerRedeemedLogs({selector: {universe: params.universe}});
    const initialReporterRedeemedLogs = await db.findInitialReporterRedeemedLogs({selector: {universe: params.universe}});

    // TODO Filter logs by account, earliestTransactionTime & latestTransactionTime

    let results = formatMarketCreatedLogs(marketCreatedLogs);

    // TODO Sort/limit results by implementing sortBy, isSortDescending, limit, & offset
    return results;
  }
}

function formatMarketCreatedLogs(transactionLogs: MarketCreatedLog[]|OrderEventLog[]|CompleteSetsPurchasedLog[]|CompleteSetsSoldLog[]|ParticipationTokensRedeemedLog[]|TradingProceedsClaimedLog[]|DisputeCrowdsourcerRedeemedLog[]|InitialReporterRedeemedLog[]): Array<AccountTransaction> {
  let formattedLogs: Array<AccountTransaction> = [];
  for (let i = 0; i < transactionLogs.length; i++) {
    console.log(typeof transactionLogs);
    // switch (typeof transactionLogs) {
    //   case
    // }
    formattedLogs.push(
      {
        action: Action.MARKET_CREATION,
        coin: Coin.ETH,
        details: "",
        fee: "",
        marketDescription: "",
        outcome: 0,
        outcomeDescription: "",
        price: "",
        quantity: "",
        timestamp: 0,
        total: "",
        transactionHash: transactionLogs[i].transactionHash,
      }
    );
  }
  return formattedLogs
}

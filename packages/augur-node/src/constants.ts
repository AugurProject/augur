import { BigNumber } from "./types";
import { BigNumber as BigNumberJS } from "bignumber.js";

export interface Precision {
  decimals: number;
  limit: string;
  zero: string;
  multiple: string;
}

const ten = new BigNumberJS(10);
const decimals = new BigNumberJS(18);
const multiple: BigNumberJS = ten.pow(decimals.toNumber());

export const PRECISION: Precision = {
  decimals: decimals.toNumber(),
  limit: ten.div(multiple).toString(),
  zero: new BigNumberJS(1).div(multiple).toString(),
  multiple: multiple.toString(),
};

// WARNING: Update this only if this release requires destroying all existing Augur Node Databases
export const DB_VERSION = 3;
export const DB_FILE = "augur-%s-%s.db";
export const DB_WARP_SYNC_FILE = "%s-%s-%s.warp";
export const DB_WARP_SYNC_FILE_ENDING = "-%s-%s.warp";
export const POUCH_DB_DIR = "augur-pouch-%s-%s";
export const DUMP_EVERY_BLOCKS = 100;

export const ETHER = "ether";
export const MINIMUM_TRADE_SIZE = "0.000001";

export const BN_WEI_PER_ETHER: BigNumber = new BigNumber(10).pow(18);
export const WEI_PER_ETHER: string = BN_WEI_PER_ETHER.toString();

export const ZERO = new BigNumber(0);
export const ONE = new BigNumber(1);

export enum TokenType {
  ReputationToken,
  ShareToken,
  DisputeCrowdsourcer,
  DisputeWindow,
  FeeToken,
}

export enum ControlMessageType {
  ServerStart = "ServerStart",
  ServerError = "ServerError",
  WebsocketError = "WebsocketError",
  WebsocketClose = "WebsocketClose",
  BulkSyncStarted = "BulkSyncStarted",
  BulkSyncFinished = "BulkSyncFinished",
  BulkOrphansCheckStarted = "BulkOrphansCheckStarted",
  BulkOrphansCheckFinished = "BulkOrphansCheckFinished",
}

export enum SubscriptionEventNames {
  DisputeWindowOpened = "DisputeWindowOpened",
  CompleteSetsPurchased = "CompleteSetsPurchased",
  CompleteSetsSold = "CompleteSetsSold",
  DisputeCrowdsourcerCompleted = "DisputeCrowdsourcerCompleted",
  DisputeCrowdsourcerContribution = "DisputeCrowdsourcerContribution",
  DisputeCrowdsourcerCreated = "DisputeCrowdsourcerCreated",
  DisputeCrowdsourcerRedeemedLog = "DisputeCrowdsourcerRedeemedLog",
  DisputeWindowClosed = "DisputeWindowClosed",
  DisputeWindowCreated = "DisputeWindowCreated",
  DisputeWindowRedeemed = "DisputeWindowRedeemed",
  InitialReportSubmitted = "InitialReportSubmitted",
  InitialReporterRedeemed = "InitialReporterRedeemed",
  InitialReporterTransferred = "InitialReporterTransferred",
  MarketCreated = "MarketCreated",
  MarketFinalized = "MarketFinalized",
  MarketMigrated = "MarketMigrated",
  MarketState = "MarketState",
  OrderCanceled = "OrderCanceled",
  OrderCreated = "OrderCreated",
  OrderFilled = "OrderFilled",
  ReportingParticipantDisavowed = "ReportingParticipantDisavowed",
  SyncFinished = "SyncFinished",
  TokensTransferred = "TokensTransferred",
  TradingProceedsClaimed = "TradingProceedsClaimed",
  UniverseCreated = "UniverseCreated",
  Burn = "Burn",
  TokensBurned = "TokensBurned",
  Approval = "Approval",
}

export enum MarketType {
  yesNo,
  categorical,
  scalar,
}

export interface NetworkNames {
  [key: number]: string;
}

export const NETWORK_NAMES: NetworkNames = {
  1: "Mainnet",
  3: "Ropsten",
  4: "Rinkeby",
  42: "Kovan",
};

const SECONDS_PER_DAY = 3600 * 24;
export const CONTRACT_INTERVAL = {
  DESIGNATED_REPORTING_DURATION_SECONDS: 3 * SECONDS_PER_DAY,
    DISPUTE_ROUND_DURATION_SECONDS: 7 * SECONDS_PER_DAY,
    FORK_DURATION_SECONDS: 60 * SECONDS_PER_DAY,
};

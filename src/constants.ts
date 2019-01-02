import BigNumber from "bignumber.js";
import { string } from "io-ts";

export interface Precision {
  decimals: number;
  limit: string;
  zero: string;
  multiple: string;
}

const ten = new BigNumber(10, 10);
const decimals = new BigNumber(18, 10);
const multiple: BigNumber = ten.exponentiatedBy(decimals.toNumber());

export const PRECISION: Precision = {
  decimals: decimals.toNumber(),
  limit: ten.dividedBy(multiple).toString(),
  zero: new BigNumber(1, 10).dividedBy(multiple).toString(),
  multiple: multiple.toString(),
};

// WARNING: Update this only if this release requires destroying all existing Augur Node Databases
export const DB_VERSION = 2;
export const DB_FILE = "augur-%s-%s.db";
export const DB_WARP_SYNC_FILE = "%s-%s-%s.warp";
export const DB_WARP_SYNC_FILE_ENDING = "-%s-%s.warp";
export const DUMP_EVERY_BLOCKS = 100;

export const ETHER = "ether";
export const MINIMUM_TRADE_SIZE = "0.000001";

export const BN_WEI_PER_ETHER: BigNumber = new BigNumber(10, 10).exponentiatedBy(18);
export const WEI_PER_ETHER: string = BN_WEI_PER_ETHER.toString();

export const ZERO = new BigNumber(0);
export const ONE = new BigNumber(1);

export enum TokenType {
  ReputationToken,
  ShareToken,
  DisputeCrowdsourcer,
  FeeWindow,
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
  FeeWindowOpened = "FeeWindowOpened",
  CompleteSetsPurchased = "CompleteSetsPurchased",
  CompleteSetsSold = "CompleteSetsSold",
  DisputeCrowdsourcerCompleted = "DisputeCrowdsourcerCompleted",
  DisputeCrowdsourcerContribution = "DisputeCrowdsourcerContribution",
  DisputeCrowdsourcerCreated = "DisputeCrowdsourcerCreated",
  DisputeCrowdsourcerRedeemedLog = "DisputeCrowdsourcerRedeemedLog",
  FeeWindowClosed = "FeeWindowClosed",
  FeeWindowCreated = "FeeWindowCreated",
  FeeWindowRedeemed = "FeeWindowRedeemed",
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

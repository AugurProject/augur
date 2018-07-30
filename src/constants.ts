import BigNumber from "bignumber.js";

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
  limit: ten.dividedBy(multiple).toFixed(),
  zero: new BigNumber(1, 10).dividedBy(multiple).toFixed(),
  multiple: multiple.toFixed(),
};

export const MINIMUM_TRADE_SIZE = "0.000001";

export const BN_WEI_PER_ETHER: BigNumber = new BigNumber(10, 10).exponentiatedBy(18);
export const WEI_PER_ETHER: string = BN_WEI_PER_ETHER.toFixed();

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
}

export enum SubscriptionEventNames {
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
  MarketState = "MarketState",
  OrderCanceled = "OrderCanceled",
  OrderCreated = "OrderCreated",
  OrderFilled = "OrderFilled",
  ReportingParticipantDisavowed = "ReportingParticipantDisavowed",
  SyncFinished = "SyncFinished",
  TokensTransferred = "TokensTransferred",
  TradingProceedsClaimed = "TradingProceedsClaimed",
  UniverseCreated = "UniverseCreated",
}

export enum MarketType {
  yesNo,
  categorical,
  scalar,
}

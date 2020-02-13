import { utils as ethersUtils } from "ethers";
import { OrderEventType as LogOrderEventType } from "./state/logs/types";
import { BigNumber } from "bignumber.js";

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

export enum ACCOUNT_TYPES {
  U_PORT = "uPort",
  LEDGER = "ledger",
  PRIVATE_KEY = "privateKey",
  UNLOCKED_ETHEREUM_NODE = "unlockedEthereumNode",
  META_MASK = "metaMask",
  TREZOR = "trezor",
  EDGE = "edge",
}

export enum SubscriptionEventName {
  BulkSyncComplete = "BulkSyncComplete",
  CompleteSetsPurchased = "CompleteSetsPurchased",
  CompleteSetsSold = "CompleteSetsSold",
  DisputeCrowdsourcerCompleted = "DisputeCrowdsourcerCompleted",
  DisputeCrowdsourcerContribution = "DisputeCrowdsourcerContribution",
  DisputeCrowdsourcerCreated = "DisputeCrowdsourcerCreated",
  DisputeCrowdsourcerRedeemed = "DisputeCrowdsourcerRedeemed",
  DisputeWindowCreated = "DisputeWindowCreated",
  InitialReportSubmitted = "InitialReportSubmitted",
  InitialReporterRedeemed = "InitialReporterRedeemed",
  InitialReporterTransferred = "InitialReporterTransferred",
  MarketCreated = "MarketCreated",
  MarketFinalized = "MarketFinalized",
  MarketMigrated = "MarketMigrated",
  MarketParticipantsDisavowed = "MarketParticipantsDisavowed",
  MarketTransferred = "MarketTransferred",
  MarketVolumeChanged = "MarketVolumeChanged",
  MarketOIChanged = "MarketOIChanged",
  NewBlock = "NewBlock",
  OrderEvent = "OrderEvent",
  ParticipationTokensRedeemed = "ParticipationTokensRedeemed",
  ProfitLossChanged = "ProfitLossChanged",
  ReportingParticipantDisavowed = "ReportingParticipantDisavowed",
  SDKReady = "SDKReady",
  GnosisSafeStatus = "GnosisSafeStatus",
  TimestampSet = "TimestampSet",
  TokenBalanceChanged = "TokenBalanceChanged",
  TokensBurned = "TokensBurned",
  TokensMinted = "TokensMinted",
  TokensTransferred = "TokensTransferred",
  TradingProceedsClaimed = "TradingProceedsClaimed",
  UniverseCreated = "UniverseCreated",
  UniverseForked = "UniverseForked",
  UserDataSynced = "UserDataSynced",
  MarketsUpdated = "updated:Markets",
  DBMarketCreatedEvent = "DerivedDB:updated:Markets",
  ReportingStateChanged = "ReportingStateChanged",
  ZeroXReady = "ZeroXReady",
}

export enum TXEventName {
  AwaitingSigning = "AwaitingSigning",
  Pending = "Pending",
  Success = "Success",
  Failure = "Failure",
  RelayerDown = "RelayerDown",
  FeeTooLow = "FeeTooLow",
}

export function isSubscriptionEventName(eventName: string): string | null {
  let retVal = -1;

  Object.values(SubscriptionEventName).every((value: any, index: number): boolean => {
    if (value === eventName) {
      retVal = index;
      return false;
    }
    return true;
  });

  if (retVal !== -1) {
    return eventName;
  }

  return null;
}

export enum ControlMessageType {
  BulkOrphansCheckFinished = "BulkOrphansCheckFinished",
  BulkOrphansCheckStarted = "BulkOrphansCheckStarted",
  BulkSyncFinished = "BulkSyncFinished",
  BulkSyncStarted = "BulkSyncStarted",
  ServerError = "ServerError",
  ServerStart = "ServerStart",
  WebsocketClose = "WebsocketClose",
  WebsocketError = "WebsocketError",
}

export const ETHER = new ethersUtils.BigNumber(10).pow(18);

export const TRADE_GAS_BUFFER = new BigNumber("600000", 10);

export const MAX_FILLS_PER_TX = new BigNumber("3", 10);

export const MAX_GAS_LIMIT_FOR_TRADE = new BigNumber("3500000", 10);

export const PLACE_ORDER_NO_SHARES = {
  2: new BigNumber("547694", 10),
  3: new BigNumber("562138", 10),
  4: new BigNumber("576582", 10),
  5: new BigNumber("591026", 10),
  6: new BigNumber("605470", 10),
  7: new BigNumber("619914", 10),
  8: new BigNumber("634358", 10),
};

export const PLACE_ORDER_WITH_SHARES = {
  2: new BigNumber("695034", 10),
  3: new BigNumber("794664", 10),
  4: new BigNumber("894294", 10),
  5: new BigNumber("993924", 10),
  6: new BigNumber("1093554", 10),
  7: new BigNumber("1193184", 10),
  8: new BigNumber("1292814", 10),
};

export const WORST_CASE_FILL = {
  2: new BigNumber("935219", 10),
  3: new BigNumber("996763", 10),
  4: new BigNumber("1058302", 10),
  5: new BigNumber("1119834", 10),
  6: new BigNumber("1181369", 10),
  7: new BigNumber("1242902", 10),
  8: new BigNumber("1242902", 10),
};

export const CLAIM_GAS_COST = new BigNumber(794379);

export const ORDER_TYPES = {
  BID: new BigNumber(0),
  ASK: new BigNumber(1),
};

export const MALFORMED_OUTCOME = 'malformed outcome';

export const INVALID_OUTCOME = 0;

export const MAX_TRADE_GAS_PERCENTAGE_DIVISOR = 100;

export const DEFAULT_GAS_PRICE_IN_GWEI = 4;

export const EULERS_NUMBER = 2.71828182845905;

export const MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI = new BigNumber(10).multipliedBy(10**18); // $10 minimum profit on selling Invalid for the filter to trigger

export const SECONDS_IN_AN_HOUR = new BigNumber(3600, 10);

export const SECONDS_IN_A_DAY = new BigNumber(86400, 10);

export const SECONDS_IN_A_YEAR = new BigNumber(SECONDS_IN_A_DAY).multipliedBy(365);

export const GENESIS = 'Genesis';

export enum MarketReportingStateByNum {
  'PreReporting',
  'DesignatedReporting',
  'OpenReporting',
  'CrowdsourcingDispute',
  'AwaitingNextWindow',
  'AwaitingFinalization',
  'Finalized',
  'Forking',
  'AwaitingForkMigration'
}

export enum MarketReportingState {
  PreReporting = 'PreReporting',
  DesignatedReporting = 'DesignatedReporting',
  OpenReporting = 'OpenReporting',
  CrowdsourcingDispute = 'CrowdsourcingDispute',
  AwaitingNextWindow = 'AwaitingNextWindow',
  AwaitingFinalization = 'AwaitingFinalization',
  Finalized = 'Finalized',
  Forking = 'Forking',
  AwaitingForkMigration = 'AwaitingForkMigration'
}

export enum OrderEventType {
  Create = LogOrderEventType.Create,
  Cancel = LogOrderEventType.Cancel,
  Fill   = LogOrderEventType.Fill,
  Expire = 3
}

export const orderTypes = ['0x00', '0x01'];

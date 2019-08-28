export type Address = string;
export type Bytes32 = string;
export type PayoutNumerators = string[];
export type Timestamp = string;

export interface GenericEventDBDescription {
  EventName: string;
  indexes: string[];
}

export interface Doc {
  _id: string;
  _rev: string;
}

export interface Timestamped {
  timestamp: Timestamp;
}

export interface Log {
  blockNumber: number;
  blockHash: Bytes32;
  transactionIndex: number;
  transactionHash: Bytes32;
  logIndex: number;
}

export interface CompleteSetsPurchasedLog extends Log, Doc, Timestamped {
  universe: Address;
  market: Address;
  account: Address;
  numCompleteSets: string;
  marketOI: string;
}

export interface CompleteSetsSoldLog extends Log, Doc, Timestamped {
  universe: Address;
  market: Address;
  account: Address;
  numCompleteSets: string;
  marketOI: string;
  marketCreatorFees: string;
  reporterFees: string;
}

export interface DisputeCrowdsourcerCompletedLog extends Log, Doc {
  universe: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  size: string;
  nextWindowStartTime: Timestamp;
  pacingOn: boolean;
}

export interface DisputeCrowdsourcerContributionLog
  extends Log,
    Doc,
    Timestamped {
  universe: Address;
  reporter: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  payoutNumerators: PayoutNumerators;
  amountStaked: string;
  description: string;
}

export interface DisputeCrowdsourcerCreatedLog extends Log, Doc {
  universe: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  payoutNumerators: PayoutNumerators;
  size: string;
}

export interface DisputeCrowdsourcerRedeemedLog extends Log, Doc, Timestamped {
  universe: Address;
  reporter: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  amountRedeemed: string;
  repReceived: string;
  payoutNumerators: PayoutNumerators;
}

export interface DisputeWindowCreatedLog extends Log, Doc {
  universe: Address;
  disputeWindow: Address;
  startTime: Timestamp;
  endTime: Timestamp;
  id: number;
  initial: boolean;
}

export interface InitialReporterRedeemedLog extends Log, Doc, Timestamped {
  universe: Address;
  reporter: Address;
  market: Address;
  amountRedeemed: string;
  repReceived: string;
  payoutNumerators: PayoutNumerators;
}

export interface InitialReportSubmittedLog extends Log, Doc, Timestamped {
  universe: Address;
  reporter: Address;
  market: Address;
  initialReporter: Address;
  amountStaked: string;
  isDesignatedReporter: boolean;
  payoutNumerators: PayoutNumerators;
  description: string;
}

export interface MarketCreatedLogExtraInfo {
  description: string;
  longDescription?: string;
  resolutionSource?: string;
  backupSource?: string;
  _scalarDenomination?: string;
}

export interface MarketCreatedLog extends Log, Doc, Timestamped {
  universe: Address;
  endTime: Timestamp;
  extraInfo: string;
  market: Address;
  marketCreator: Address;
  designatedReporter: Address;
  feeDivisor: string;
  prices: string[];
  marketType: MarketType;
  numTicks: string;
  outcomes: string[];
  timestamp: string;
}

export interface MarketFinalizedLog extends Log, Doc, Timestamped {
  universe: Address;
  market: Address;
  winningPayoutNumerators: string[];
}

export interface MarketMigratedLog extends Log, Doc {
  market: Address;
  originalUniverse: Address;
  newUniverse: Address;
}

export enum MarketType {
  YesNo = 0,
  Categorical = 1,
  Scalar = 2,
}

export enum MarketTypeName {
  YesNo = 'yesNo',
  Categorical = 'categorical',
  Scalar = 'scalar',
}

export interface MarketVolumeChangedLog extends Log, Doc {
  universe: Address;
  market: Address;
  volume: string;
  outcomeVolumes: string[];
}

export interface MarketOIChangedLog extends Log, Doc {
  universe: Address;
  market: Address;
  marketOI: string;
}

//  addressData
//  0:  kycToken
//  1:  orderCreator
//  2:  orderFiller (Fill)
//
//  uint256Data
//  0:  price
//  1:  amount
//  2:  outcome
//  3:  tokenRefund (Cancel)
//  4:  sharesRefund (Cancel)
//  5:  fees (Fill)
//  6:  amountFilled (Fill)
//  7:  timestamp
export interface OrderEventLog extends Log, Doc, Timestamped {
  universe: Address;
  market: Address;
  eventType: OrderEventType;
  orderType: OrderType;
  orderId: Bytes32;
  tradeGroupId: Bytes32;
  addressData: Address[];
  uint256Data: string[];
}

export interface ParsedOrderEventLog extends Log, Doc, Timestamped {
  universe: Address;
  market: Address;
  eventType: OrderEventType;
  orderType: OrderType;
  orderId: Bytes32;
  tradeGroupId: Bytes32;
  kycToken: Address;
  orderCreator: Address;
  orderFiller: Address;
  price: string;
  amount: string;
  outcome: string;
  tokenRefund: string;
  sharesRefund: string;
  fees: string;
  amountFilled: string;
  timestamp: string;
  sharesEscrowed: string;
  tokensEscrowed: string;
}

export enum OrderType {
  Bid = 0,
  Ask = 1,
}

export enum OrderEventType {
  Create = 0,
  Cancel = 1,
  Fill = 2,
}

export enum OrderState {
  ALL = 'ALL',
  OPEN = 'OPEN',
  FILLED = 'FILLED',
  CANCELED = 'CANCELED',
}

export enum OrderEventAddressValue {
  kycToken = 0,
  orderCreator = 1,
  orderFiller = 2,
}

export enum OrderEventUint256Value {
  price = 0,
  amount = 1,
  outcome = 2,
  tokenRefund = 3,
  sharesRefund = 4,
  fees = 5,
  amountFilled = 6,
  timestamp = 7,
  sharesEscrowed = 8,
  tokensEscrowed = 9,
}

export const ORDER_EVENT_KYC_TOKEN = 'addressData.0';
export const ORDER_EVENT_CREATOR = 'addressData.1';
export const ORDER_EVENT_FILLER = 'addressData.2';
export const ORDER_EVENT_PRICE = 'uint256Data.0';
export const ORDER_EVENT_AMOUNT = 'uint256Data.1';
export const ORDER_EVENT_OUTCOME = 'uint256Data.2';
export const ORDER_EVENT_TOKEN_REFUND = 'uint256Data.3';
export const ORDER_EVENT_SHARES_REFUND = 'uint256Data.4';
export const ORDER_EVENT_FEES = 'uint256Data.5';
export const ORDER_EVENT_AMOUNT_FILLED = 'uint256Data.6';
export const ORDER_EVENT_TIMESTAMP = 'uint256Data.7';
export const ORDER_EVENT_SHARES_ESCROWED = 'uint256Data.8';
export const ORDER_EVENT_TOKENS_ESCROWED = 'uint256Data.9';

export interface ParticipationTokensRedeemedLog extends Log, Doc, Timestamped {
  universe: Address;
  disputeWindow: Address;
  account: Address;
  attoParticipationTokens: string;
  feePayoutShare: string;
}

export interface ProfitLossChangedLog extends Log, Doc, Timestamped {
  universe: Address;
  market: Address;
  account: Address;
  outcome: string;
  netPosition: string;
  avgPrice: string;
  realizedProfit: string;
  frozenFunds: string;
  realizedCost: string;
}

export interface TimestampSetLog extends Log, Doc {
  newTimestamp: Timestamp;
}

export interface TokenBalanceChangedLog extends Log, Doc {
  universe: Address;
  owner: Address;
  token: string;
  tokenType: string;
  market: Address;
  balance: string;
}

export interface TradingProceedsClaimedLog extends Log, Doc, Timestamped {
  universe: Address;
  shareToken: Address;
  sender: Address;
  market: Address;
  outcome: string;
  numShares: string;
  numPayoutTokens: string;
  finalTokenBalance: string;
  fees: string;
}

export interface UniverseForkedLog extends Log, Doc {
  universe: Address;
  forkingMarket: Address;
}

export interface LiquidityData {
  [spread: number]: number;
}

export interface MarketData extends Log, Doc {
  universe: Address;
  endTime: Timestamp;
  extraInfo: string;
  market: Address;
  marketCreator: Address;
  designatedReporter: Address;
  feeDivisor: string;
  prices: string[];
  marketType: MarketType;
  numTicks: string;
  outcomes: string[];
  timestamp: string;
  volume: string;
  outcomeVolumes: string[];
  marketOI: string;
  invalidFilter: boolean;
  liquidity: LiquidityData;
}

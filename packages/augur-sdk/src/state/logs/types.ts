import { MarketReportingState } from '../../constants';
import { ExtraInfoTemplate } from '@augurproject/artifacts';

export type Address = string;
export type Bytes32 = string;
export type PayoutNumerators = string[];
export type Timestamp = string;

export interface GenericEventDBDescription {
  EventName: string;
  indexes: string[];
  primaryKey?: string;
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

export interface MarketsUpdatedLog {
  data: MarketData[]
}

export interface CompleteSetsPurchasedLog extends Log, Timestamped {
  universe: Address;
  market: Address;
  account: Address;
  numCompleteSets: string;
  marketOI: string;
}

export interface CompleteSetsSoldLog extends Log, Timestamped {
  universe: Address;
  market: Address;
  account: Address;
  numCompleteSets: string;
  marketOI: string;
  marketCreatorFees: string;
  reporterFees: string;
}

export interface DisputeCrowdsourcerCompletedLog extends Log {
  universe: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  size: string;
  nextWindowStartTime: Timestamp;
  nextWindowEndTime: Timestamp;
  pacingOn: boolean;
  payoutNumerators: PayoutNumerators;
}

export interface DisputeCrowdsourcerContributionLog
  extends Log,
    Timestamped {
  universe: Address;
  reporter: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  payoutNumerators: PayoutNumerators;
  amountStaked: string;
  description: string;
  disputeRound: string;
}

export interface DisputeCrowdsourcerCreatedLog extends Log {
  universe: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  payoutNumerators: PayoutNumerators;
  size: string;
  disputeRound: string;
}

export interface DisputeCrowdsourcerRedeemedLog extends Log, Timestamped {
  universe: Address;
  reporter: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  amountRedeemed: string;
  repReceived: string;
  payoutNumerators: PayoutNumerators;
}

export interface DisputeWindowCreatedLog extends Log {
  universe: Address;
  disputeWindow: Address;
  startTime: Timestamp;
  endTime: Timestamp;
  id: number;
  initial: boolean;
}

export interface InitialReporterRedeemedLog extends Log, Timestamped {
  universe: Address;
  reporter: Address;
  market: Address;
  initialReporter: Address;
  amountRedeemed: string;
  repReceived: string;
  payoutNumerators: PayoutNumerators;
}

export interface InitialReportSubmittedLog extends Log, Timestamped {
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
  _scalarDenomination?: string;
  categories?: string[];
  tags?: string[];
}

export interface MarketCreatedLog extends Log, Timestamped {
  universe: Address;
  endTime: Timestamp;
  extraInfo: string;
  market: Address;
  marketCreator: Address;
  designatedReporter: Address;
  feePerCashInAttoCash: string;
  prices: string[];
  marketType: MarketType;
  numTicks: string;
  outcomes: string[];
  timestamp: string;
}

export interface MarketFinalizedLog extends Log, Timestamped {
  universe: Address;
  market: Address;
  winningPayoutNumerators: string[];
}

export interface MarketMigratedLog extends Log {
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
  YesNo = 'YesNo',
  Categorical = 'Categorical',
  Scalar = 'Scalar',
}

export enum CommonOutcomes {
  Malformed = 'malformed outcome',
  Invalid = 'Invalid',
}

export enum YesNoOutcomes {
  No = 'No',
  Yes = 'Yes',
}

export type TradeDirection = 0 | 1;
export type NumOutcomes = 3 | 4 | 5 | 6 | 7 | 8;
export type OutcomeNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface MarketVolumeChangedLog extends Log {
  universe: Address;
  market: Address;
  volume: string;
  outcomeVolumes: string[];
}

export interface MarketOIChangedLog extends Log {
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
export interface OrderEventLog extends Log, Timestamped {
  universe: Address;
  market: Address;
  eventType: OrderEventType;
  orderType: OrderType;
  orderId: Bytes32;
  tradeGroupId: Bytes32;
  addressData: Address[];
  uint256Data: string[];
}

export interface ParsedOrderEventLog extends Log, Timestamped {
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

export interface CurrentOrder extends ParsedOrderEventLog {
  open: number; // 0 == false, 1 == true. Can't index booleans
}

// from IExchangeCore.sol
export interface CancelLog extends Log {
  makerAddress: Address;
  feeRecipientAddress: Address;
  makerAssetData: Bytes32;
  takerAssetData: Bytes32;
  senderAddress: Address;
  orderHash: Bytes32;
}

export interface CancelledOrderLog {
  orderHash: Bytes32;
  senderAddress: Address;
  makerAddress: Address;
  feeRecipientAddress: Address;
  market: Address;
  kycToken: Address;
  price: string;
  outcome: string;
  orderType: string;
  blockNumber: number;
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

export interface ParticipationTokensRedeemedLog extends Log, Timestamped {
  universe: Address;
  disputeWindow: Address;
  account: Address;
  attoParticipationTokens: string;
  feePayoutShare: string;
}

export interface ReportingParticipantDisavowedLog extends Log, Timestamped {
  universe: Address;
  market: Address;
  reportingParticipant: Address;
}

export interface ProfitLossChangedLog extends Log, Timestamped {
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

export interface TimestampSetLog extends Log {
  newTimestamp: Timestamp;
}

export enum TokenType {
  ReputationToken,
  ShareToken,
  DisputeCrowdsourcer,
  FeeWindow, // No longer a valid type but here for backward compat with Augur Node processing
  FeeToken, // No longer a valid type but here for backward compat with Augur Node processing
  ParticipationToken,
}

export interface TokensMinted extends Log {
  universe: Address;
  token: Address;
  target: Address;
  amount: string;
  tokenType: TokenType;
  market: Address;
  totalSupply: string;
}

export interface TokenBalanceChangedLog extends Log {
  universe: Address;
  owner: Address;
  token: string;
  tokenType: TokenType;
  market: Address;
  balance: string;
  outcome: string;
}

export interface ShareTokenBalanceChangedLog extends Log {
  universe: Address;
  account: Address;
  market: Address;
  outcome: string;
  balance: string;
}

export interface TradingProceedsClaimedLog extends Log, Timestamped {
  universe: Address;
  shareToken: Address;
  sender: Address;
  market: Address;
  outcome: string;
  numShares: string;
  numPayoutTokens: string;
  fees: string;
}

export interface UniverseForkedLog extends Log {
  universe: Address;
  forkingMarket: Address;
}

export interface UniverseCreatedLog extends Log {
  parentUniverse: Address;
  childUniverse: Address;
  payoutNumerators: string[];
  creationTimestamp: string;
}

export interface LiquidityData {
  [spread: number]: number;
}

export interface ExtraInfo {
  _scalarDenomination?: string;
  longDescription?: string;
  description?: string;
  categories?: string[];
  template?: ExtraInfoTemplate;
}

export interface MarketData extends Log {
  universe: Address;
  endTime: Timestamp;
  extraInfo: ExtraInfo;
  market: Address;
  marketCreator: Address;
  designatedReporter: Address;
  feePerCashInAttoCash: string;
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
  feeDivisor: number;
  hasRecentlyDepletedLiquidity: boolean;
  finalizationBlockNumber: string;
  finalizationTime: string;
  winningPayoutNumerators: string[];
  reportingState: MarketReportingState;
  tentativeWinningPayoutNumerators: string[];
  totalRepStakedInMarket: string;
  disputeRound: string;
  nextWindowStartTime: string;
  nextWindowEndTime: string;
  pacingOn: boolean;
  noShowBond: string;
  disavowed: boolean;
  isTemplate: boolean;
  feePercent: number;
  finalized: boolean;
}

export interface DisputeDoc extends Log {
  payoutNumerators: string[];
  bondSizeCurrent: string; // current round bond size
  stakeCurrent: string; // current round stake that's been provided by reporters so far
  stakeRemaining: string; // stake remaining (bond size - stakeCurrent)
  tentativeWinning: boolean; // outcome is currently tentative winner
  totalRepStakedInPayout: string; // total REP across all rounds staked in completed bonds for this payout
  tentativeWinningOnRound: string; // Indicates that on a particular round this was the tentative winning payout
  disputeRound: string; // number of times the dispute bond has been filled in the reporting process; initial report is round 1
}

export interface InitialReporterTransferredLog extends Log {
  universe: string;
  market: string;
  from: string;
  to: string;
}

export interface MarketParticipantsDisavowedLog extends Log {
  universe: string;
  market: string;
}

export interface MarketTransferredLog extends Log {
  universe: string;
  market: string;
  from: string;
  to: string;
}

export interface TokensTransferredLog extends Log {
  universe: string;
  market: string;
  token: string;
  from: string;
  to: string;
  value: string;
  tokenType: number;
}

export interface TransferSingleLog extends Log {
  operator: string;
  from: string;
  to: string;
  id: string;
  value: string;
}

export interface TransferBatchLog extends Log {
  operator: string;
  from: string;
  to: string;
  ids: string[];
  values: string[];
}

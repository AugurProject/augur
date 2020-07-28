import { MarketReportingState, MarketType, OrderEventType } from './constants';
import { ExtraInfoTemplate } from './templates/types';

export type Address = string;
export type Bytes32 = string;
export type PayoutNumerators = string[];
export type LogTimestamp = string;
export type UnixTimestamp = number;

export interface GenericEventDBDescription {
  EventName: string;
  indexes: string[];
  primaryKey?: string;
}

export interface Log {
  blockNumber: number;
  blockHash: Bytes32;
  transactionIndex: number;
  transactionHash: Bytes32;
  logIndex: number;
}

export interface TimestampedLog extends Log {
  timestamp: LogTimestamp;
}

export interface MarketsUpdatedLog {
  data: MarketData[];
}

export interface CompleteSetsPurchasedLog extends TimestampedLog {
  universe: Address;
  market: Address;
  account: Address;
  numCompleteSets: string;
  marketOI: string;
}

export interface CompleteSetsSoldLog extends TimestampedLog {
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
  nextWindowStartTime: LogTimestamp;
  nextWindowEndTime: LogTimestamp;
  pacingOn: boolean;
  payoutNumerators: PayoutNumerators;
  totalRepStakedInPayout: string;
  totalRepStakedInMarket: string;
  disputeRound: string;
}

export interface DisputeCrowdsourcerContributionLog extends TimestampedLog {
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

export interface DisputeCrowdsourcerRedeemedLog extends TimestampedLog {
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
  startTime: LogTimestamp;
  endTime: LogTimestamp;
  id: number;
  initial: boolean;
}

export interface InitialReporterRedeemedLog extends TimestampedLog {
  universe: Address;
  reporter: Address;
  market: Address;
  initialReporter: Address;
  amountRedeemed: string;
  repReceived: string;
  payoutNumerators: PayoutNumerators;
}

export interface InitialReportSubmittedLog extends TimestampedLog {
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

export interface MarketCreatedLog extends TimestampedLog {
  universe: Address;
  endTime: LogTimestamp;
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

export interface MarketFinalizedLog extends TimestampedLog {
  universe: Address;
  market: Address;
  winningPayoutNumerators: string[];
}

export interface MarketMigratedLog extends Log {
  market: Address;
  originalUniverse: Address;
  newUniverse: Address;
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
//  0:  orderCreator
//  1:  orderFiller (Fill)
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
export interface OrderEventLog extends TimestampedLog {
  universe: Address;
  market: Address;
  eventType: OrderEventType;
  orderType: OrderType;
  orderId: Bytes32;
  tradeGroupId: Bytes32;
  addressData: Address[];
  uint256Data: string[];
}

export interface ParsedOrderEventLog extends TimestampedLog {
  universe: Address;
  market: Address;
  eventType: OrderEventType;
  orderType: OrderType;
  orderId: Bytes32;
  tradeGroupId: Bytes32;
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

export interface CancelZeroXOrderLog extends Log {
  universe: Address;
  account: Address;
  market: Address;
  price: string;
  amount: string;
  outcome: string;
  orderType: string;
  orderHash: Bytes32;
  blockNumber: number;
}

export enum OrderType {
  Bid = 0,
  Ask = 1,
}

export enum OrderTypeHex {
  Bid = '0x00',
  Ask = '0x01',
}

export enum OrderState {
  ALL = 'ALL',
  OPEN = 'OPEN',
  FILLED = 'FILLED',
  CANCELED = 'CANCELED',
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

export interface ParticipationTokensRedeemedLog extends TimestampedLog {
  universe: Address;
  disputeWindow: Address;
  account: Address;
  attoParticipationTokens: string;
  feePayoutShare: string;
}

export interface ReportingParticipantDisavowedLog extends TimestampedLog {
  universe: Address;
  market: Address;
  reportingParticipant: Address;
}

export interface ProfitLossChangedLog extends TimestampedLog {
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
  newTimestamp: LogTimestamp;
}

export enum TokenType {
  ReputationToken,
  DisputeCrowdsourcer,
  ParticipationToken,
}

export interface ReportingFeeChangedLog extends Log {
  universe: Address;
  reportingFee: string;
}

export interface TokensMintedLog extends Log {
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

export interface TradingProceedsClaimedLog extends TimestampedLog {
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
  creationTimestamp: LogTimestamp;
  address: Address;
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

/*
 * MarketData is a derived, amalgam, type of pre-processed data. Unlike
 * contract logs, timestamps are stored as numbers, and other tidbits.
 */
export interface MarketData extends Log {
  universe: Address;
  endTime: UnixTimestamp;
  extraInfo: ExtraInfo;
  market: Address;
  marketCreator: Address;
  designatedReporter: Address;
  feePerCashInAttoCash: string;
  prices: string[];
  marketType: MarketType;
  numTicks: string;
  outcomes: string[];
  timestamp: UnixTimestamp; // DerivedDB pre-processes this to be a number
  creationTime: UnixTimestamp;
  volume: string;
  outcomeVolumes: string[];
  marketOI: string;
  invalidFilter: boolean;
  liquidity: LiquidityData;
  feeDivisor: number;
  hasRecentlyDepletedLiquidity: boolean;
  lastPassingLiquidityCheck: number;
  liquidityDirty: boolean;
  finalizationBlockNumber: string;
  finalizationTime: UnixTimestamp;
  winningPayoutNumerators: string[];
  reportingState: MarketReportingState;
  tentativeWinningPayoutNumerators: string[];
  totalRepStakedInMarket: string;
  disputeRound: string;
  nextWindowStartTime: UnixTimestamp;
  nextWindowEndTime: UnixTimestamp;
  pacingOn: boolean;
  noShowBond: string;
  disavowed: boolean;
  isTemplate: boolean;
  feePercent: number;
  finalized: boolean;
  lastTradedTimestamp: UnixTimestamp;
  numberOfTrades: number;
  isWarpSync: boolean;
  groupHash?: string;
  groupType?: string;
  groupLine?: string;
  groupHeader?: string;
  groupTitle?: string;
  groupEstDatetime?: string;
  liquidityPool?: string;
  groupPlaceholderOutcomes?: string[];
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
  universe: Address;
  market: Address;
  from: Address;
  to: Address;
}

export interface MarketParticipantsDisavowedLog extends Log {
  universe: Address;
  market: Address;
}

export interface MarketTransferredLog extends Log {
  universe: Address;
  market: Address;
  from: Address;
  to: Address;
}

export interface TokensTransferredLog extends Log {
  universe: Address;
  market: Address;
  token: Address;
  from: Address;
  to: Address;
  value: string;
  tokenType: number;
}

export interface TransferSingleLog extends Log {
  operator: string;
  from: Address;
  to: Address;
  id: string;
  value: string;
}

export interface TransferBatchLog extends Log {
  operator: string;
  from: Address;
  to: Address;
  ids: string[];
  values: string[];
}

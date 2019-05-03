import { string, number } from "prop-types";
import { AddressZero } from "ethers/constants";

export type Address = string;
export type Bytes32 = string;
export type Timestamp = string;

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

export interface CompleteSetsPurchasedLog extends Log, Doc {
  universe: Address;
  market: Address;
  account: Address;
  numCompleteSets: string;
  marketOI: string;
}

export interface CompleteSetsSoldLog extends Log, Doc {
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
  nextWindowStartTime: Timestamp;
  pacingOn: boolean;
}

export interface DisputeCrowdsourcerContributionLog extends Log, Doc {
  universe: Address;
  reporter: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  amountStaked: number;
  description: string;
}

export interface DisputeWindowCreatedLog extends Log, Doc {
  universe: Address;
  disputeWindow: Address;
  startTime: Timestamp;
  endTime: Timestamp;
  id: number;
  initial: boolean;
}

export interface InitialReportSubmittedLog extends Log, Doc {
  universe: Address;
  reporter: Address;
  market: Address;
  amountStaked: string;
  isDesignatedReporter: boolean;
  payoutNumerators: Array<string>;
  description: string;
}

export interface MarketCreatedLogExtraInfo {
  description: string;
  longDescription?: string;
  resolutionSource?: string;
  _scalarDenomination?: string;
}

export interface MarketCreatedLog extends Log, Doc {
  universe: Address;
  endTime: Timestamp;
  topic: string;
  extraInfo: string;
  market: Address;
  marketCreator: Address;
  designatedReporter: Address;
  feeDivisor: string;
  prices: Array<Price>;
  marketType: MarketType;
  numTicks: string;
  outcomes: Array<string>;
}

export interface MarketFinalizedLog extends Log, Doc, Timestamped {
  universe: Address;
  market: Address;
  winningPayoutNumerators: Array<PayoutNumerator>;
}

export interface MarketMigratedLog extends Log, Doc {
  market: Address;
  originalUniverse: Address;
  newUniverse: Address;
}

export enum MarketType {
  YesNo = 0,
  Categorical = 1,
  Scalar = 2
}

export interface MarketVolumeChangedLog extends Log, Doc {
  universe: Address;
  market: Address;
  volume: string;
}

export interface OrderCanceledLog extends Log, Doc {
  universe: Address;
  shareToken: Address;
  sender: Address;
  market: Address;
  orderId: Bytes32;
  orderType: OrderType;
  tokenRefund: string;
  sharesRefund: string;
}

//  addressData
//  0:  kycToken
//  1:  orderCreator (Fill)
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
  addressData: Array<Address>;
  uint256Data: Array<string>;
}

export enum OrderType {
  Bid = 0,
  Ask = 1
}

export enum OrderEventType {
  Create = 0,
  Cancel = 1,
  PriceChanged = 2,
  Fill = 3,
}

export interface PayoutNumerator {
  _hex: string;
}

export interface Price {
  _hex: string;
}

export interface ProfitLossChangedLog extends Log, Doc, Timestamped {
  universe: string;
  market: string;
  account: string;
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

export interface UniverseForkedLog extends Log, Doc {
  universe: Address;
  forkingMarket: Address;
}

export interface TokenBalanceChangedLog extends Log, Doc {
  universe: string;
  owner: string;
  token: string;
  tokenType: string;
  market: string;
  balance: string;
}

import { string, number } from "prop-types";
import { AddressZero } from "ethers/constants";

type Address = string;
type Bytes32 = string;
type Timestamp = string;

export interface Doc {
  _id: string;
  _rev: string;
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
  longDescription?: string;
  resolutionSource?: string;
  _scalarDenomination?: string;
}

export interface MarketCreatedLog extends Log, Doc {
  universe: string;
  endTime: Timestamp;
  topic: string;
  description: string;
  extraInfo: string;
  market: string;
  marketCreator: string;
  minPrice: string;
  maxPrice: string;
  marketType: MarketType;
  numTicks: string;
  outcomes: Array<string>;
}

export interface MarketFinalizedLog extends Log, Doc {
  universe: Address;
  market: Address;
  timestamp: Timestamp;
  winningPayoutNumerators: Array<number>;
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

export interface OrderCreatedLog extends Log, Doc {
  orderType: number;
  amount: string;
  price: string;
  creator: string;
  tradeGroupId: string;
  orderId: string;
  universe: string;
  marketId: string;
  kycToken: string;
  outcome: string;
}

export interface OrderFilledLog extends Log, Doc {
  universe: string;
  filler: string;
  creator: string;
  marketId: string;
  orderId: string;
  price: string;
  outcome: string;
  marketCreatorFees: string;
  reporterFees: string;
  amountFilled: string;
  tradeGroupId: string;
}

export interface ProfitLossChangedLog extends Log, Doc {
  universe: string;
  market: string;
  account: string;
  outcome: string;
  netPosition: string;
  avgPrice: string;
  realizedProfit: string;
  frozenFunds: string;
  realizedCost: string;
  timestamp: Timestamp;
}

export interface TimestampSetLog extends Log, Doc {
  newTimestamp: Timestamp;
}

export interface UniverseForkedLog extends Log, Doc {
  universe: Address;
  market: Address;
}

export interface TokenBalanceChangedLog extends Log, Doc {
  universe: string;
  owner: string;
  token: string;
  tokenType: string;
  market: string;
  balance: string;
}

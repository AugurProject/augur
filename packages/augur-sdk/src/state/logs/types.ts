export type Address = string;
export type Bytes32 = string;
export type PayoutNumerators = Array<string>;
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
  nextWindowStartTime: Timestamp;
  pacingOn: boolean;
}

export interface DisputeCrowdsourcerContributionLog extends Log, Doc, Timestamped {
  universe: Address;
  reporter: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  payoutNumerators: PayoutNumerators;
  amountStaked: string;
  description: string;
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
  amountStaked: string;
  isDesignatedReporter: boolean;
  payoutNumerators: PayoutNumerators;
  description: string;
}

export interface MarketCreatedLogExtraInfo {
  description: string;
  longDescription?: string;
  resolutionSource?: string;
  _scalarDenomination?: string;
}

export interface MarketCreatedLog extends Log, Doc, Timestamped {
  universe: Address;
  endTime: Timestamp;
  topic: string;
  extraInfo: string;
  market: Address;
  marketCreator: Address;
  designatedReporter: Address;
  feeDivisor: string;
  prices: Array<string>;
  marketType: MarketType;
  numTicks: string;
  outcomes: Array<string>;
}

export interface MarketFinalizedLog extends Log, Doc, Timestamped {
  universe: Address;
  market: Address;
  winningPayoutNumerators: Array<string>;
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

export interface OrderEventLog extends Log, Doc, Timestamped {
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
  Ask = 1
}

export enum OrderEventType {
  Create = 0,
  Cancel = 1,
  PriceChanged = 2,
  Fill = 3,
}

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
  market: Address,
  outcome: string,
  numShares: string;
  numPayoutTokens: string;
  finalTokenBalance: string;
  fees: string;
}

export interface UniverseForkedLog extends Log, Doc {
  universe: Address;
  forkingMarket: Address;
}

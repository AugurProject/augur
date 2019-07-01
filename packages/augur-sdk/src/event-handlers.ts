type Address = string;
type Bytes32 = string;

export interface FormattedEventLog {
  address: Address;
  blockNumber: number;
  logIndex: number;
  transactionHash: Bytes32;
  transactionIndex: number;
  contractName: string;
  eventName: string;
  blockHash: Bytes32;
  removed: boolean;
}

export interface CompleteSetsPurchased extends FormattedEventLog {
  universe: Address;
  market: Address;
  account: Address;
  numCompleteSets: number;
  marketOI: number;
  timetamp: number;
}

export interface CompleteSetsSold extends FormattedEventLog {
  universe: Address;
  market: Address;
  account: Address;
  numCompleteSets: number;
  marketOI: number;
  fees: number;
  timestamp: number;
}

export interface DisputeCrowdsourcerCompleted extends FormattedEventLog {
  universe: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  nextWindowStartTime: number;
  pacingOn: boolean;
}

export interface DisputeCrowdsourcerContribution extends FormattedEventLog {
  universe: Address;
  reporter: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  amountStaked: number;
  description: string;
  timestamp: number;
}

export interface DisputeCrowdsourcerCreated extends FormattedEventLog {
  universe: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  payoutNumerators: number[];
  size: number;
}

export interface DisputeCrowdsourcerRedeemed extends FormattedEventLog {
  universe: Address;
  reporter: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  amountRedeemed: number;
  repReceived: number;
  payoutNumerators: number[];
  timestamp: number;
}

export interface DisputeWindowCreated extends FormattedEventLog {
  universe: Address;
  disputeWindow: Address;
  startTime: number;
  endTime: number;
  id: number;
  initial: boolean;
}

export interface InitialReportSubmitted extends FormattedEventLog {
  universe: Address;
  reporter: Address;
  market: Address;
  amountStaked: number;
  isDesignatedReporter: boolean;
  payoutNumerators: number[];
  description: string;
  timestamp: number;

}

export interface InitialReporterRedeemed extends FormattedEventLog {
  universe: Address;
  reporter: Address;
  market: Address;
  amountRedeemed: number;
  repReceived: number;
  payoutNumerators: number[];
  timestamp: number;
}

export interface InitialReporterTransferred extends FormattedEventLog {
  universe: Address;
  market: Address;
  from: Address;
  to: Address;
}

export interface MarketCreated extends FormattedEventLog {
  universe: Address;
  endTime: Address;
  topic: Address;
  extraInfo: string;
  market: Address;
  marketCreator: Address;
  designatedReporter: Address;
  feeDivisor: number;
  prices: string[];
  marketType: number;
  numTicks: number;
  outcomes: string[];
  timestamp: number;
}

export interface MarketFinalized extends FormattedEventLog {
  universe: Address;
  market: Address;
  timestamp: number;
  winningPayoutNumerators: number[];
}

export interface MarketMigrated extends FormattedEventLog {
  market: Address;
  originalUniverse: Address;
  newUniverse: Address;
}

export interface MarketParticipantsDisavowed extends FormattedEventLog {
  universe: Address;
  market: Address;
}

export interface MarketTransferred extends FormattedEventLog {
  universe: Address;
  market: Address;
  from: Address;
  to: Address;
}

export interface MarketVolumeChanged extends FormattedEventLog {
  universe: Address;
  market: Address;
  volume: number;
  outcomeVolumes: number[];
}

export interface NewBlock extends FormattedEventLog {
  blocksBehindCurrent: number;
  highestAvailableBlockNumber: number;
  lastSyncedBlockNumber: number;
  percentBehindCurrent: string;
  timestamp: number;
}

// XXX: TODO - verify eventType and orderType somehow
export interface OrderEvent extends FormattedEventLog {
  universe: Address;
  market: Address;
  eventType: string;
  orderType: string;
  orderId: Bytes32;
  tradeGroupId: Bytes32;
  addressData: Address[];
  uint256Data: number[];
}

export interface ParticipationTokensRedeemed extends FormattedEventLog {
  universe: Address;
  disputeWindow: Address;
  account: Address;
  attoParticipationTokens: number;
  feePayoutShare: number;
  timestamp: number;
}

export interface ProfitLossChanged extends FormattedEventLog {
  universe: Address;
  market: Address;
  account: Address;
  outcome: number;
  netPosition: number;
  avgPrice: number;
  frozenFunds: number;
  realizedCost: number;
  timestamp: number;
}

export interface ReportingParticipantDisavowed extends FormattedEventLog {
  univeres: Address;
  market: Address;
  reportingParticipant: Address;
}

export interface TimestampSet extends FormattedEventLog {
  newTimestamp: number;
}

export interface TokenBalanceChanged extends FormattedEventLog {
  universe: Address;
  owner: Address;
  token: Address;
  TokeyType: string;
  market: Address;
  balance: number;
  outcome: number;
}

export interface TokensBurned extends FormattedEventLog {
  universe: Address;
  token: Address;
  target: Address;
  amount: number;
  tokenType: string;
  market: Address;
  totalSupply: number;
}

export interface TokensMinted extends FormattedEventLog {
  universe: Address;
  token: Address;
  target: Address;
  amount: number;
  tokenType: string;
  market: Address;
  totalSupply: number;
}

export interface TokensTransferred extends FormattedEventLog {
  universe: Address;
  token: Address;
  from: Address;
  to: Address;
  value: number;
  tokenType: string;
  market: Address;
}

export interface TradingProceedsClaimed extends FormattedEventLog {
  universe: Address;
  shareToken; Address;
  sender: Address;
  market: Address;
  outcome: number;
  numShares: number;
  numPayoutTokens: number;
  finalTokenBalance: number;
  fees: number;
  timestamp: number;
}

export interface UniverseCreated extends FormattedEventLog {
  parentUniverse: Address;
  childUniverse: Address;
  payoutNumerators: number[];
}

export interface UniverseForked extends FormattedEventLog {
  address: Address;
  universe: Address;
  forkingMarket: Address;
}

export type SubscriptionType = MarketCreated | InitialReportSubmitted | DisputeCrowdsourcerCreated | DisputeCrowdsourcerContribution | DisputeCrowdsourcerCompleted | InitialReporterRedeemed | DisputeCrowdsourcerRedeemed | ReportingParticipantDisavowed | MarketParticipantsDisavowed | MarketFinalized | MarketMigrated | UniverseForked | UniverseCreated | OrderEvent | CompleteSetsPurchased | CompleteSetsSold | TradingProceedsClaimed | TokensTransferred | TokensMinted | TokensBurned | TokenBalanceChanged | DisputeWindowCreated | InitialReporterTransferred | MarketTransferred | MarketVolumeChanged | ProfitLossChanged | ParticipationTokensRedeemed | TimestampSet | NewBlock;

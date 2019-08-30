import { TransactionMetadata } from "contract-dependencies-ethers/build";
import { TXEventName } from "./constants";

type Address = string;
type Bytes32 = string;

export interface Event {
  eventName: string;
}

export interface UserDataSynced extends Event {
  trackedUsers: string[];
}

export interface FormattedEventLog extends Event {
  address: Address;
  blockNumber: number;
  logIndex: number;
  transactionHash: Bytes32;
  transactionIndex: number;
  contractName: string;
  blockHash: Bytes32;
  removed: boolean;
}

export interface CompleteSetsPurchased extends FormattedEventLog {
  universe: Address;
  market: Address;
  account: Address;
  numCompleteSets: string;
  marketOI: string;
  timetamp: number;
}

export interface CompleteSetsSold extends FormattedEventLog {
  universe: Address;
  market: Address;
  account: Address;
  numCompleteSets: string;
  marketOI: string;
  fees: string;
  timestamp: string;
}

export interface DisputeCrowdsourcerCompleted extends FormattedEventLog {
  universe: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  nextWindowStartTime: string;
  pacingOn: boolean;
}

export interface DisputeCrowdsourcerContribution extends FormattedEventLog {
  universe: Address;
  reporter: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  amountStaked: string;
  description: string;
  timestamp: string;
}

export interface DisputeCrowdsourcerCreated extends FormattedEventLog {
  universe: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  payoutNumerators: string[];
  size: number;
}

export interface DisputeCrowdsourcerRedeemed extends FormattedEventLog {
  universe: Address;
  reporter: Address;
  market: Address;
  disputeCrowdsourcer: Address;
  amountRedeemed: string;
  repReceived: string;
  payoutNumerators: string[];
  timestamp: string;
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
  amountStaked: string;
  isDesignatedReporter: boolean;
  payoutNumerators: string[];
  description: string;
  timestamp: string;

}

export interface InitialReporterRedeemed extends FormattedEventLog {
  universe: Address;
  reporter: Address;
  market: Address;
  amountRedeemed: string;
  repReceived: string;
  payoutNumerators: string[];
  timestamp: string;
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
  numTicks: string;
  outcomes: string[];
  timestamp: string;
}

export interface MarketFinalized extends FormattedEventLog {
  universe: Address;
  market: Address;
  timestamp: string;
  winningPayoutNumerators: string[];
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
  outcomeVolumes: string[];
}

export interface MarketOIChanged extends FormattedEventLog {
  universe: Address;
  market: Address;
  marketOI: number;
}

export interface NewBlock extends FormattedEventLog {
  blocksBehindCurrent: number;
  highestAvailableBlockNumber: number;
  lastSyncedBlockNumber: number;
  percentSynced: string;
  timestamp: number;
}

// @TODO:: TODO - verify eventType and orderType somehow
export interface OrderEvent extends FormattedEventLog {
  universe: Address;
  market: Address;
  eventType: string;
  orderType: string;
  orderId: Bytes32;
  tradeGroupId: Bytes32;
  addressData: Address[];
  uint256Data: string[];
}

export interface ParticipationTokensRedeemed extends FormattedEventLog {
  universe: Address;
  disputeWindow: Address;
  account: Address;
  attoParticipationTokens: string;
  feePayoutShare: string;
  timestamp: string;
}

export interface ProfitLossChanged extends FormattedEventLog {
  universe: Address;
  market: Address;
  account: Address;
  outcome: string;
  netPosition: string;
  avgPrice: string;
  frozenFunds: string;
  realizedCost: string;
  timestamp: string;
}

export interface ReportingParticipantDisavowed extends FormattedEventLog {
  univeres: Address;
  market: Address;
  reportingParticipant: Address;
}

export interface TimestampSet extends FormattedEventLog {
  newtimestamp: string;
}

export interface TokenBalanceChanged extends FormattedEventLog {
  universe: Address;
  owner: Address;
  token: Address;
  TokeyType: string;
  market: Address;
  balance: string;
  outcome: string;
}

export interface TokensBurned extends FormattedEventLog {
  universe: Address;
  token: Address;
  target: Address;
  amount: string;
  tokenType: string;
  market: Address;
  totalSupply: string;
}

export interface TokensMinted extends FormattedEventLog {
  universe: Address;
  token: Address;
  target: Address;
  amount: string;
  tokenType: string;
  market: Address;
  totalSupply: string;
}

export interface TokensTransferred extends FormattedEventLog {
  universe: Address;
  token: Address;
  from: Address;
  to: Address;
  value: string;
  tokenType: string;
  market: Address;
}

export interface TradingProceedsClaimed extends FormattedEventLog {
  universe: Address;
  shareToken; Address;
  sender: Address;
  market: Address;
  outcome: string;
  numShares: string;
  numPayoutTokens: string;
  finalTokenBalance: string;
  fees: string;
  timestamp: string;
}

export interface UniverseCreated extends FormattedEventLog {
  parentUniverse: Address;
  childUniverse: Address;
  payoutNumerators: string[];
}

export interface UniverseForked extends FormattedEventLog {
  address: Address;
  universe: Address;
  forkingMarket: Address;
}

export interface TXStatus {
  transaction: TransactionMetadata;
  eventName: TXEventName;
  hash?: string;
}

export type SubscriptionType = MarketCreated | InitialReportSubmitted | DisputeCrowdsourcerCreated | DisputeCrowdsourcerContribution | DisputeCrowdsourcerCompleted | InitialReporterRedeemed | DisputeCrowdsourcerRedeemed | ReportingParticipantDisavowed | MarketParticipantsDisavowed | MarketFinalized | MarketMigrated | UniverseForked | UniverseCreated | OrderEvent | CompleteSetsPurchased | CompleteSetsSold | TradingProceedsClaimed | TokensTransferred | TokensMinted | TokensBurned | TokenBalanceChanged | DisputeWindowCreated | InitialReporterTransferred | MarketTransferred | MarketVolumeChanged | MarketOIChanged | ProfitLossChanged | ParticipationTokensRedeemed | TimestampSet | NewBlock | TXStatus;

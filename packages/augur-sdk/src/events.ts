import { EventEmitter } from "events";
import { SubscriptionEventNames } from "./constants";

// Some events, like MarketState, are not always sourced from logs and do not have an "eventName"
// Always make sure it is present without having to specify in every .emit call
class EventNameEmitter extends EventEmitter {
  public emit(eventName: SubscriptionEventNames | string, ...args: Array<any>): boolean {
    return super.emit(eventName, ...args);
  }
}

export const augurEmitter: EventNameEmitter = new EventNameEmitter();

// 0 because we need one per websocket client
augurEmitter.setMaxListeners(0);

type Address = string;
type Bytes32 = string;

// These are the subscription event types used in Augur and the Connectors. 

interface FormattedEventLog {
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

// event InitialReportSubmitted(address indexed universe, address indexed reporter, address indexed market, uint256 amountStaked, bool isDesignatedReporter, uint256[] payoutNumerators, string description, uint256 timestamp);
// event DisputeCrowdsourcerCreated(address indexed universe, address indexed market, address disputeCrowdsourcer, uint256[] payoutNumerators, uint256 size);
// event DisputeCrowdsourcerContribution(address indexed universe, address indexed reporter, address indexed market, address disputeCrowdsourcer, uint256 amountStaked, string description, uint256 timestamp);
// event DisputeCrowdsourcerCompleted(address indexed universe, address indexed market, address disputeCrowdsourcer, uint256 nextWindowStartTime, bool pacingOn);
// event InitialReporterRedeemed(address indexed universe, address indexed reporter, address indexed market, uint256 amountRedeemed, uint256 repReceived, uint256[] payoutNumerators, uint256 timestamp);
// event DisputeCrowdsourcerRedeemed(address indexed universe, address indexed reporter, address indexed market, address disputeCrowdsourcer, uint256 amountRedeemed, uint256 repReceived, uint256[] payoutNumerators, uint256 timestamp);
// event ReportingParticipantDisavowed(address indexed universe, address indexed market, address reportingParticipant);
// event MarketParticipantsDisavowed(address indexed universe, address indexed market);
// event MarketFinalized(address indexed universe, address indexed market, uint256 timestamp, uint256[] winningPayoutNumerators);
// event MarketMigrated(address indexed market, address indexed originalUniverse, address indexed newUniverse);
// event UniverseForked(address indexed universe, IMarket forkingMarket);
// event UniverseCreated(address indexed parentUniverse, address indexed childUniverse, uint256[] payoutNumerators);

// event OrderEvent(address indexed universe, address indexed market, OrderEventType indexed eventType, Order.Types orderType, bytes32 orderId, bytes32 tradeGroupId, address[] addressData, uint256[] uint256Data);

// event CompleteSetsPurchased(address indexed universe, address indexed market, address indexed account, uint256 numCompleteSets, uint256 marketOI, uint256 timestamp);
// event CompleteSetsSold(address indexed universe, address indexed market, address indexed account, uint256 numCompleteSets, uint256 marketOI, uint256 fees, uint256 timestamp);
// event TradingProceedsClaimed(address indexed universe, address indexed shareToken, address indexed sender, address market, uint256 outcome, uint256 numShares, uint256 numPayoutTokens, uint256 finalTokenBalance, uint256 fees, uint256 timestamp);
// event TokensTransferred(address indexed universe, address token, address indexed from, address indexed to, uint256 value, TokenType tokenType, address market);
// event TokensMinted(address indexed universe, address indexed token, address indexed target, uint256 amount, TokenType tokenType, address market, uint256 totalSupply);
// event TokensBurned(address indexed universe, address indexed token, address indexed target, uint256 amount, TokenType tokenType, address market, uint256 totalSupply);
// event TokenBalanceChanged(address indexed universe, address indexed owner, address token, TokenType tokenType, address market, uint256 balance, uint256 outcome);
// event DisputeWindowCreated(address indexed universe, address disputeWindow, uint256 startTime, uint256 endTime, uint256 id, bool initial);
// event InitialReporterTransferred(address indexed universe, address indexed market, address from, address to);
// event MarketTransferred(address indexed universe, address indexed market, address from, address to);
// event MarketVolumeChanged(address indexed universe, address indexed market, uint256 volume, uint256[] outcomeVolumes);
// event ProfitLossChanged(address indexed universe, address indexed market, address indexed account, uint256 outcome, int256 netPosition, uint256 avgPrice, int256 realizedProfit, int256 frozenFunds, int256 realizedCost, uint256 timestamp);
// event ParticipationTokensRedeemed(address indexed universe, address indexed disputeWindow, address indexed account, uint256 attoParticipationTokens, uint256 feePayoutShare, uint256 timestamp);
// event TimestampSet(uint256 newTimestamp);

export interface CompleteSetsPurchased extends FormattedEventLog {

}

export interface CompleteSetsSold extends FormattedEventLog {

}

export interface DisputeCrowdsourcerCompleted extends FormattedEventLog {
}

export interface DisputeCrowdsourcerContribution extends FormattedEventLog {

}

export interface DisputeCrowdsourcerCreated extends FormattedEventLog {

}

export interface DisputeCrowdsourcerRedeemed extends FormattedEventLog {

}

export interface DisputeWindowCreated extends FormattedEventLog {

}

export interface InitialReportSubmitted extends FormattedEventLog {

}

export interface InitialReporterRedeemed extends FormattedEventLog {

}

export interface InitialReporterTransferred extends FormattedEventLog {

}

export interface MarketCreated extends FormattedEventLog {
  universe: Address;
  endTime: number;
  topic: string;
  extraInfo: string;
  market: Address;
  marketCreator: Address;
  designatedReporter: Address;
  feeDivisor: number;
  prices: number[];
  marketType: number;
  numTicks: number;
  outcomes: string[];
  timestamp: number;
}

export interface MarketFinalized extends FormattedEventLog {

}

export interface MarketMigrated extends FormattedEventLog {

}

export interface MarketParticipantsDisavowed extends FormattedEventLog {

}

export interface MarketTransferred extends FormattedEventLog {

}

export interface MarketVolumeChanged extends FormattedEventLog {

}

export interface NewBlock extends FormattedEventLog {

}

export interface OrderEvent extends FormattedEventLog {

}

export interface ParticipationTokensRedeemed extends FormattedEventLog {

}

export interface ProfitLossChanged extends FormattedEventLog {

}

export interface ReportingParticipantDisavowed extends FormattedEventLog {

}

export interface TimestampSet extends FormattedEventLog {

}

export interface TokenBalanceChanged extends FormattedEventLog {

}

export interface TokensBurned extends FormattedEventLog {

}

export interface TokensMinted extends FormattedEventLog {

}

export interface TokensTransferred extends FormattedEventLog {

}

export interface TradingProceedsClaimed extends FormattedEventLog {

}

export interface UniverseCreated extends FormattedEventLog {

}

export interface UniverseForked extends FormattedEventLog {

}

export interface SubscriptionTypes extends FormattedEventLog {

}

export type Callback = (...args: Array<SubscriptionTypes>) => void;


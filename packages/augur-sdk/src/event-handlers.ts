type Address = string;
type Bytes32 = string;

// These are the subscription event types used in Augur and the Connectors.

export class FormattedEventLog {
  address: Address;
  blockNumber: BigNumber;
  logIndex: number;
  transactionHash: Bytes32;
  transactionIndex: number;
  contractName: string;
  eventName: string;
  blockHash: Bytes32;
  removed: boolean;
}

export class CompleteSetsPurchased extends FormattedEventLog {
  // event CompleteSetsPurchased(address indexed universe, address indexed market, address indexed account, uint256 numCompleteSets, uint256 marketOI, uint256 timestamp);
}

export class CompleteSetsSold extends FormattedEventLog {
  // event CompleteSetsSold(address indexed universe, address indexed market, address indexed account, uint256 numCompleteSets, uint256 marketOI, uint256 fees, uint256 timestamp);
}

export class DisputeCrowdsourcerCompleted extends FormattedEventLog {
  // event DisputeCrowdsourcerCompleted(address indexed universe, address indexed market, address disputeCrowdsourcer, uint256 nextWindowStartTime, bool pacingOn);

}

export class DisputeCrowdsourcerContribution extends FormattedEventLog {
  // event DisputeCrowdsourcerContribution(address indexed universe, address indexed reporter, address indexed market, address disputeCrowdsourcer, uint256 amountStaked, string description, uint256 timestamp);
}

export class DisputeCrowdsourcerCreated extends FormattedEventLog {
  // event DisputeCrowdsourcerCreated(address indexed universe, address indexed market, address disputeCrowdsourcer, uint256[] payoutNumerators, uint256 size);
}

export class DisputeCrowdsourcerRedeemed extends FormattedEventLog {
  // event DisputeCrowdsourcerRedeemed(address indexed universe, address indexed reporter, address indexed market, address disputeCrowdsourcer, uint256 amountRedeemed, uint256 repReceived, uint256[] payoutNumerators, uint256 timestamp);
}

export class DisputeWindowCreated extends FormattedEventLog {
  // event DisputeWindowCreated(address indexed universe, address disputeWindow, uint256 startTime, uint256 endTime, uint256 id, bool initial);
}

export class InitialReportSubmitted extends FormattedEventLog {
  // event InitialReportSubmitted(address indexed universe, address indexed reporter, address indexed market, uint256 amountStaked, bool isDesignatedReporter, uint256[] payoutNumerators, string description, uint256 timestamp);

}

export class InitialReporterRedeemed extends FormattedEventLog {

}

export class InitialReporterTransferred extends FormattedEventLog {
  // event InitialReporterTransferred(address indexed universe, address indexed market, address from, address to);
}

export class MarketCreated extends FormattedEventLog {
  universe: Address;
  endTime: Address;
  topic: Address;
  extraInfo: string;
  market: BigNumber;
  marketCreator: Address;
  designatedReporter: Address;
  feeDivisor: number;
  prices: BigNumber[];
  marketType: number;
  numTicks: number;
  outcomes: string[];
  timestamp: number;
}

export class MarketFinalized extends FormattedEventLog {
  // event MarketFinalized(address indexed universe, address indexed market, uint256 timestamp, uint256[] winningPayoutNumerators);
}

export class MarketMigrated extends FormattedEventLog {
  // event MarketMigrated(address indexed market, address indexed originalUniverse, address indexed newUniverse);
}

export class MarketParticipantsDisavowed extends FormattedEventLog {
  // event MarketParticipantsDisavowed(address indexed universe, address indexed market);
}

export class MarketTransferred extends FormattedEventLog {
  // event MarketTransferred(address indexed universe, address indexed market, address from, address to);
}

export class MarketVolumeChanged extends FormattedEventLog {
  // event MarketVolumeChanged(address indexed universe, address indexed market, uint256 volume, uint256[] outcomeVolumes);
}

export class NewBlock extends FormattedEventLog {

}

export class OrderEvent extends FormattedEventLog {
  // event OrderEvent(address indexed universe, address indexed market, OrderEventType indexed eventType, Order.Types orderType, bytes32 orderId, bytes32 tradeGroupId, address[] addressData, uint256[] uint256Data);
}

export class ParticipationTokensRedeemed extends FormattedEventLog {
  // event ParticipationTokensRedeemed(address indexed universe, address indexed disputeWindow, address indexed account, uint256 attoParticipationTokens, uint256 feePayoutShare, uint256 timestamp);
}

export class ProfitLossChanged extends FormattedEventLog {
  // event ProfitLossChanged(address indexed universe, address indexed market, address indexed account, uint256 outcome, int256 netPosition, uint256 avgPrice, int256 realizedProfit, int256 frozenFunds, int256 realizedCost, uint256 timestamp);
}

export class ReportingParticipantDisavowed extends FormattedEventLog {
  // event ReportingParticipantDisavowed(address indexed universe, address indexed market, address reportingParticipant);
}

export class TimestampSet extends FormattedEventLog {
  // event TimestampSet(uint256 newTimestamp);
}

export class TokenBalanceChanged extends FormattedEventLog {
  // event TokenBalanceChanged(address indexed universe, address indexed owner, address token, TokenType tokenType, address market, uint256 balance, uint256 outcome);
}

export class TokensBurned extends FormattedEventLog {
  // event TokensBurned(address indexed universe, address indexed token, address indexed target, uint256 amount, TokenType tokenType, address market, uint256 totalSupply);
}

export class TokensMinted extends FormattedEventLog {
  // event TokensMinted(address indexed universe, address indexed token, address indexed target, uint256 amount, TokenType tokenType, address market, uint256 totalSupply);
}

export class TokensTransferred extends FormattedEventLog {
  // event TokensTransferred(address indexed universe, address token, address indexed from, address indexed to, uint256 value, TokenType tokenType, address market);
}

export class TradingProceedsClaimed extends FormattedEventLog {
  // event TradingProceedsClaimed(address indexed universe, address indexed shareToken, address indexed sender, address market, uint256 outcome, uint256 numShares, uint256 numPayoutTokens, uint256 finalTokenBalance, uint256 fees, uint256 timestamp);
}

export class UniverseCreated extends FormattedEventLog {
  // event UniverseCreated(address indexed parentUniverse, address indexed childUniverse, uint256[] payoutNumerators);
}

export class UniverseForked extends FormattedEventLog {
  // event UniverseForked(address indexed universe, IMarket forkingMarket);
}

export type SubscriptionType = MarketCreated | InitialReportSubmitted | DisputeCrowdsourcerCreated | DisputeCrowdsourcerContribution | DisputeCrowdsourcerCompleted | InitialReporterRedeemed | DisputeCrowdsourcerRedeemed | ReportingParticipantDisavowed | MarketParticipantsDisavowed | MarketFinalized | MarketMigrated | UniverseForked | UniverseCreated | OrderEvent | CompleteSetsPurchased | CompleteSetsSold | TradingProceedsClaimed | TokensTransferred | TokensMinted | TokensBurned | TokenBalanceChanged | DisputeWindowCreated | InitialReporterTransferred | MarketTransferred | MarketVolumeChanged | ProfitLossChanged | ParticipationTokensRedeemed | TimestampSet;

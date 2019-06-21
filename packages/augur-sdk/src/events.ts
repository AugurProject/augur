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
  [inputName: string]: any;
}

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


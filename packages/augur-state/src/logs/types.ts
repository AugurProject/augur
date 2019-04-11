import { string, number } from "prop-types";
import { AddressZero } from "ethers/constants";

type Address = string;
type Bytes32 = string;

export interface Log {
    blockNumber: number;
    blockHash: Bytes32;
    transactionIndex: number;
    transactionHash: Bytes32;
    logIndex: number;
    timestamp: number;
}

export interface CompleteSetsPurchasedLog extends Log {
  universe: Address;
  market: Address;
  account: Address;
  numCompleteSets: string;
  marketOI: string;
}

export interface CompleteSetsSoldLog extends Log {
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
}

export interface InitialReportSubmittedLog extends Log {
  universe: Address;
  reporter: Address;
  market: Address;
  amountStaked: string;
  isDesignatedReporter: boolean;
  payoutNumerators: Array<string>;
  description: string;
}

export interface OrderFilledLog extends Log {
  universe: Address;
  filler: Address;
  creator: Address;
  marketId: Address;
  orderId: string;
  marketCreatorFees: string;
  reporterFees: string;
  amountFilled: string;
  outcome: string;
  tradeGroupId: string;
}

export interface OrderCreatedLog extends Log {
  orderType: number;
  amount: string;
  price: string;
  creator: Address;
  tradeGroupId: string;
  orderId: string;
  universe: Address;
  marketId: Address;
  kycToken: string;
  outcome: string;
}

export interface MarketCreatedLogExtraInfo {
  longDescription?: string;
  resolutionSource?: string;
  _scalarDenomination?: string;
}

export interface MarketCreatedLog extends Log {
  universe: Address;
  endTime: string;
  topic: string;
  description: string;
  extraInfo: string;
  market: Address;
  marketCreator: Address;
  minPrice: string;
  maxPrice: string;
  marketType: number;
  numTicks: string;
  outcomes: Array<string>;
}

export interface MarketFinalizedLog extends Log {
  universe: Address;
  market: Address;
}

export interface MarketMigratedLog extends Log {
  market: Address;
  originalUniverse: Address;
  newUniverse: Address;
}

export interface MarketVolumeChangedLog extends Log {
  universe: Address;
  market: Address;
  volume: string;
}

export interface UniverseForkedLog extends Log {
  universe: Address;
}

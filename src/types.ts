import { Augur, FormattedEventLog } from "augur.js";
export { Block, FormattedEventLog } from "augur.js";

import * as Knex from "knex";

export enum ReportingState {
  PRE_REPORTING = "PRE_REPORTING",
  DESIGNATED_REPORTING = "DESIGNATED_REPORTING",
  AWAITING_FORK_MIGRATION = "AWAITING_FORK_MIGRATION",
  DESIGNATED_DISPUTE = "DESIGNATED_DISPUTE",
  FIRST_REPORTING = "FIRST_REPORTING",
  FIRST_DISPUTE = "FIRST_DISPUTE",
  AWAITING_NO_REPORT_MIGRATION = "AWAITING_NO_REPORT_MIGRATION",
  LAST_REPORTING = "LAST_REPORTING",
  LAST_DISPUTE = "LAST_DISPUTE",
  FORKING = "FORKING",
  AWAITING_FINALIZATION = "AWAITING_FINALIZATION",
  FINALIZED = "FINALIZED",
}

export enum DisputeTokenState {
  ALL = "ALL",
  UNCLAIMED = "UNCLAIMED",
  UNFINALIZED = "UNFINALIZED",
}

export enum OrderState {
  ALL = "ALL",
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  CANCELED = "CANCELED",
}

export interface BaseTransactionRow {
  blockNumber: number;
  logIndex: number;
  transactionHash: Bytes32;
}

export interface BaseTransaction extends BaseTransactionRow {
  blockHash: Bytes32;
}

export interface WebSocketConfigs {
  pingMs?: number;
  ws?: {[config: string]: any};
  wss?: {[config: string]: any};
}

export interface EthereumNodeEndpoints {
  [protocol: string]: string;
}
export interface UploadBlockNumbers {
  [networkID: string]: number;
}

export type AbiEncodedData = string;
export type Address = string;
export type Bytes32 = string;
export type Int256 = string;

export interface MarketCreatedLogExtraInfo {
  minPrice?: string;
  maxPrice?: string;
  tags?: Array<string|null>;
  outcomeNames?: Array<string|number|null>;
  description?: string;
  longDescription?: string|null;
  resolutionSource?: string|null;
  marketType?: string;
}

export interface MarketCreatedOnContractInfo {
  marketCreatorFeeRate: string;
  feeWindow: Address;
  endTime: string;
  designatedReporter: Address;
  designatedReportStake: string;
  numTicks: string;
}

export type ErrorCallback = (err?: Error|null) => void;

export type AsyncCallback = (err?: Error|null, result?: any) => void;

export type LogProcessor = (db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback) => void;

export interface EventLogProcessor {
  add: LogProcessor;
  remove: LogProcessor;
  noAutoEmit?: boolean;
}

export interface LogProcessors {
  [contractName: string]: {
    [eventName: string]: EventLogProcessor;
  };
}

export interface JsonRpcRequest {
  id: string|number|null;
  jsonrpc: string;
  method: string;
  params: any;
}

export interface JsonRpcResponse {
  id: string|number|null;
  jsonrpc: string;
  result: any;
}

export interface GetMarketInfoRequest {
  jsonrpc: string;
  id: string|number;
  method: string;
  params: {
    market: string;
  };
}

export interface GetAccountTransferHistoryRequest {
  jsonrpc: string;
  id: string|number;
  method: string;
  params: {
    account: Address;
    token: Address|null;
  };
}

export interface MarketsContractAddressRow {
  marketID: string;
}

export interface MarketsRow {
  marketID: Address;
  universe: Address;
  marketType: string;
  numOutcomes: number;
  minPrice: string|number;
  maxPrice: string|number;
  marketCreator: Address;
  creationBlockNumber: number;
  creationFee: string|number;
  reportingFeeRate: string|number;
  marketCreatorFeeRate: string|number;
  marketCreatorFeesCollected: string|number|null;
  initialReportSize: string|number|null;
  category: string;
  tag1: string|null;
  tag2: string|null;
  volume: string|number;
  sharesOutstanding: string|number;
  marketStateID: number;
  feeWindow: Address;
  endTime: number;
  finalizationTime?: number|null;
  reportingState?: ReportingState|null;
  shortDescription: string;
  longDescription?: string|null;
  designatedReporter: Address;
  designatedReportStake: string|number;
  resolutionSource?: string|null;
  numTicks: number;
  consensusPayoutID?: number|null;
  isInvalid?: boolean|null;
}

export interface PositionsRow {
  outcome: number;
  marketID?: Address;
  numShares?: string|number;
  account?: Address;
  realizedProfitLoss?: string|number;
  unrealizedProfitLoss?: string|number;
  numSharesAdjustedForUserIntention?: string|number;
}

export interface OutcomesRow {
  marketID: Address;
  outcome: number;
  price: string|number;
  volume: string|number;
  description: string|null;
}

export interface TokensRow {
  contractAddress?: Address;
  symbol: string;
  marketID: Address;
  outcome?: number;
}

export interface CategoriesRow {
  popularity: string|number;
}

export interface BlocksRow {
  blockNumber: number;
  timestamp: number;
}

export interface DisputeTokensRow extends Payout {
  disputeToken: Address;
  marketID: Address;
  amountStaked: number;
  claimed: number;
  winning: number|null;
}

export interface DisputeTokensRowWithTokenState extends DisputeTokensRow {
  ReportingState: ReportingState;
}

export interface Payout {
  payout0: string|number;
  payout1: string|number;
  payout2: string|number|null;
  payout3: string|number|null;
  payout4: string|number|null;
  payout5: string|number|null;
  payout6: string|number|null;
  payout7: string|number|null;
  isInvalid: boolean|number;
}

export interface UIDisputeTokenInfo extends Payout {
  disputeToken: Address;
  marketID: Address;
  amountStaked: number;
  claimed: boolean;
  winningToken: boolean|null;
  ReportingState: ReportingState;
}

export interface UIDisputeTokens {
  [stakeToken: string]: UIDisputeTokenInfo;
}

export interface StakeDetails extends Payout {
  totalStaked: string;
  size: string;
  amountStaked: string;
}

export interface UIStakeInfo {
  marketID: Address;
  disputeRound: number|null;
  stakes: Array<StakeDetails>;
}

export interface UIFeeWindowCurrent {
  endBlockNumber: number|null;
  endTime: number;
  feeWindow: Address;
  feeWindowID: number;
  startBlockNumber: number;
  startTime: number;
  universe: Address;
  totalStake?: number;

}

export interface UIMarketCreatorFee {
  marketID: Address;
  unclaimedFee: string;
}

export interface UIConsensusInfo {
  outcomeID: number;
  isInvalid: boolean;
}

export interface UIOutcomeInfo {
  id: number;
  volume: string|number;
  price: string|number;
  description: string|null;
}

export interface UIMarketInfo {
  id: Address;
  universe: Address;
  marketType: string;
  numOutcomes: number;
  minPrice: string|number;
  maxPrice: string|number;
  cumulativeScale: string|number;
  author: Address;
  creationTime: number;
  creationBlock: number;
  creationFee: string|number;
  settlementFee: string;
  reportingFeeRate: string|number;
  marketCreatorFeeRate: string|number;
  marketCreatorFeesCollected: string|number|null;
  initialReportSize: string|number|null;
  category: string;
  tags: Array<string|null>;
  volume: string|number;
  outstandingShares: string|number;
  feeWindow: Address;
  endDate: number;
  finalizationTime?: number|null;
  reportingState?: ReportingState|null;
  description: string;
  extraInfo?: string|null;
  designatedReporter: Address;
  designatedReportStake: string|number;
  resolutionSource?: string|null;
  numTicks: string|number;
  tickSize: string|number;
  consensus: UIConsensusInfo|null;
  outcomes: Array<UIOutcomeInfo>;
}

export type UIMarketsInfo = Array<UIMarketInfo|null>;

// Does not extend BaseTransaction since UI is expecting "creationBlockNumber"
export interface UIOrder {
  orderID: Bytes32;
  transactionHash: Bytes32;
  logIndex: number;
  shareToken: Address;
  owner: Address;
  creationTime: number;
  creationBlockNumber: number;
  orderState: OrderState;
  price: number|string;
  amount: number|string;
  fullPrecisionPrice: number|string;
  fullPrecisionAmount: number|string;
  tokensEscrowed: number|string;
  sharesEscrowed: number|string;
}

export interface UIOrders {
  [marketID: string]: {
    [outcome: number]: {
      [orderType: string]: {
        [orderID: string]: UIOrder;
      };
    };
  };
}

export interface OrdersRow extends BaseTransactionRow {
  orderID?: Bytes32;
  marketID: Address;
  outcome: number;
  shareToken: Address;
  orderType: string;
  orderCreator: Address;
  orderState: OrderState;
  price: string;
  amount: string;
  fullPrecisionPrice: string;
  fullPrecisionAmount: string;
  tokensEscrowed: string;
  sharesEscrowed: string;
  tradeGroupID: Bytes32|null;
}

export interface UITrade {
  transactionHash: string;
  logIndex: number;
  type: string;
  price: string;
  amount: string;
  maker: boolean;
  marketCreatorFees: string;
  reporterFees: string;
  settlementFees: string;
  marketID: Address;
  outcome: number;
  shareToken: Address;
  timestamp: number;
  tradeGroupID: Bytes32|null;
}

export interface TradesRow extends BaseTransactionRow {
  orderID: Bytes32;
  marketID: Address;
  outcome: number;
  shareToken: Address;
  orderType: string;
  creator: Address;
  filler: Address;
  numCreatorTokens: string;
  numCreatorShares: string;
  numFillerTokens: string;
  numFillerShares: string;
  price: string;
  amount: string;
  marketCreatorFees: string;
  reporterFees: string;
  tradeGroupID: Bytes32|null;
}

export interface TimestampedPrice {
  price: string|number;
  timestamp: number;
}

export interface MarketPriceHistory {
  [outcome: number]: Array<TimestampedPrice>;
}

export interface MarketsRowWithCreationTime extends MarketsRow {
  creationTime: number;
}

export interface JoinedReportsMarketsRow extends Payout {
  creationBlockNumber: number;
  creationTime: number;
  logIndex: number;
  transactionHash: Bytes32;
  blockHash: Bytes32;
  marketID: Address;
  universe: Address;
  feeWindow: Address;
  crowdsourcerID: Address;
  marketType: string;
  amountStaked: string|number;

}

export interface UIReport {
  creationBlockNumber: number;
  creationTime: number;
  logIndex: number;
  transactionHash: Bytes32;
  blockHash: Bytes32;
  marketID: Address;
  feeWindow: Address;
  payoutNumerators: Array<string|number|null>;
  amountStaked: string|number;
  crowdsourcerID: Address;
  isCategorical: boolean;
  isScalar: boolean;
  isInvalid: boolean;
  isSubmitted: boolean;
}

export interface FeeWindowRow {
    feeWindow: Address;
    feeWindowID: number;
    startBlockNumber: number;
    universe: Address;
    startTime: number;
    endBlockNumber: null|number;
    endTime: number;
    fees: number|string;
}

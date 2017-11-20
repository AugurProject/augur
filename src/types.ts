import Augur from "augur.js";
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

export enum StakeTokenState {
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
  logIndex: Int256;
  transactionHash: Bytes32;
}

export interface BaseTransaction extends BaseTransactionRow {
  blockHash: Bytes32;
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

export interface Log {
  blockNumber: number;
  transactionIndex: Int256;
  transactionHash: Bytes32;
  address: Address;
  categories: Array<Int256>;
  data: AbiEncodedData;
}

export interface FormattedLog {
  blockNumber: number;
  transactionHash: Bytes32;
  transactionIndex: Int256;  
  address: Address;
  [inputName: string]: any;
}

export interface MarketCreatedLogExtraInfo {
  minPrice: string;
  maxPrice: string;
  tags?: Array<string|null>;
  description: string;
  longDescription?: string|null;
  resolutionSource?: string|null;
  marketType: string;
}

export interface MarketCreatedOnContractInfo {
  marketCreatorFeeRate: string;
  reportingWindow: Address;
  endTime: string;
  designatedReporter: Address;
  designatedReportStake: string;
  numTicks: string;
}

export interface AugurLogs {
  [contractName: string]: {
    [eventName: string]: Array<FormattedLog>;
  };
}

export type ErrorCallback = (err?: Error|null) => void;

export type AsyncCallback = (err?: Error|null, result?: any) => void;

export type LogProcessor = (db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback) => void;

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
  category: string;
  tag1: string|null;
  tag2: string|null;
  volume: string|number;
  sharesOutstanding: string|number;
  marketStateID: number;
  reportingWindow: Address;
  endTime: number;
  finalizationTime?: number|null;
  reportingState?: ReportingState|null;
  shortDescription: string;
  longDescription?: string|null;
  designatedReporter: Address;
  designatedReportStake: string|number;
  resolutionSource?: string|null;
  numTicks: number;
  consensusOutcome?: number|null;
  isInvalid?: boolean|null;
}

export interface OutcomesRow {
  marketID: Address;
  outcome: number;
  price: string|number;
  sharesOutstanding: string|number;
}

export interface BlocksRow {
  blockNumber: number;
  timestamp: number;
}

export interface StakeTokensRow {
  stakeToken: Address;
  marketID: Address;
  payout0: string|number|null;
  payout1: string|number|null;
  payout2: string|number|null;
  payout3: string|number|null;
  payout4: string|number|null;
  payout5: string|number|null;
  payout6: string|number|null;
  payout7: string|number|null;
  isInvalid: number;
  amountStaked: number;
  claimed: number;
  winningToken: number|null;
}

export interface StakeTokensRowWithReportingState extends StakeTokensRow {
  ReportingState: ReportingState;
}

export interface UIStakeTokenInfo {
  stakeToken: Address;
  marketID: Address;
  payout0: string|number|null;
  payout1: string|number|null;
  payout2: string|number|null;
  payout3: string|number|null;
  payout4: string|number|null;
  payout5: string|number|null;
  payout6: string|number|null;
  payout7: string|number|null;
  isInvalid: boolean;
  amountStaked: number;
  claimed: boolean;
  winningToken: boolean|null;
  ReportingState: ReportingState;
}

export interface UIStakeTokens {
  [stakeToken: string]: UIStakeTokenInfo;
}

export interface UIConsensusInfo {
  outcomeID: number;
  isIndeterminate: boolean;
}

export interface UIOutcomeInfo {
  id: number;
  outstandingShares: string|number;
  price: string|number|null;
}

export interface UIMarketInfo {
  id: Address;
  universe: Address;
  type: string;
  numOutcomes: number;
  minPrice: string|number;
  maxPrice: string|number;
  cumulativeScale: string|number;
  author: Address;
  creationTime: number;
  creationBlock: number;
  creationFee: string|number;
  reportingFeeRate: string|number;
  marketCreatorFeeRate: string|number;
  marketCreatorFeesCollected: string|number|null;
  category: string;
  tags: Array<string|null>;
  volume: string|number;
  outstandingShares: string|number;
  reportingWindow: Address;
  endDate: number;
  finalizationTime?: number|null;
  reportingState?: ReportingState|null;
  description: string;
  extraInfo?: string|null;
  designatedReporter: Address;
  designatedReportStake: string|number;
  resolutionSource?: string|null;
  numTicks: number;
  consensus: UIConsensusInfo|null;
  outcomes: Array<UIOutcomeInfo>;
}

export type UIMarketsInfo = Array<UIMarketInfo|null>;

// Does not extend BaseTransaction since UI is expecting "creationBlockNumber"
export interface Order {
  transactionHash: Bytes32;
  logIndex: Int256;
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
  logIndex: Int256;
  type: string;
  price: string;
  amount: string;
  maker: boolean;
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
  settlementFees: string;
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

export interface JoinedReportsMarketsRow {
  marketID: Address;
  universe: Address;
  reportingWindow: Address;
  stakeToken: Address;
  marketType: string;
  amountStaked: string|number;
  payout0: string|number|null;
  payout1: string|number|null;
  payout2: string|number|null;
  payout3: string|number|null;
  payout4: string|number|null;
  payout5: string|number|null;
  payout6: string|number|null;
  payout7: string|number|null;
  isInvalid: number;
}

export interface UIReport {
  marketID: Address;
  reportingWindow: Address;
  payoutNumerators: Array<string|number|null>;
  amountStaked: string|number;
  stakeToken: Address;
  isCategorical: boolean;
  isScalar: boolean;
  isIndeterminate: boolean;
  isSubmitted: boolean;
}

import Augur = require("augur.js");
import * as Knex from "knex";

export interface EthereumNodeEndpoints {
  [protocol: string]: string;
}
export interface UploadBlockNumbers {
  [networkId: string]: number;
}

export type AbiEncodedData = string;
export type Address = string;
export type Bytes32 = string;
export type Int256 = string;

export interface Log {
  address: Address;
  categories: Array<Int256>;
  data: AbiEncodedData;
  blockNumber: Int256;
  transactionIndex: Int256;
  transactionHash: Bytes32;
  blockHash: Bytes32;
}

export interface FormattedLog {
  address: Address;
  blockNumber: number;
  transactionIndex: Int256;
  transactionHash: Bytes32;
  blockHash: Bytes32;
  [inputName: string]: any;
}

export interface MarketCreatedLogExtraInfo {
  minPrice: string;
  maxPrice: string;
  category: string;
  tag1?: string|null;
  tag2?: string|null;
  shortDescription: string;
  longDescription?: string|null;
  resolutionSource?: string|null;
  marketType?: string;
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
  marketId: string;
}

export interface MarketsRow {
  marketId: Address;
  universe: Address;
  marketType: string;
  numOutcomes: number;
  minPrice: string|number;
  maxPrice: string|number;
  marketCreator: Address;
  creationTime: number;
  creationBlockNumber: number;
  creationFee: string|number;
  marketCreatorFeeRate: string|number;
  marketCreatorFeesCollected: string|number|null;
  topic: string;
  tag1: string|null;
  tag2: string|null;
  volume: string|number;
  sharesOutstanding: string|number;
  reportingWindow: Address;
  endTime: number;
  finalizationTime: number|null;
  shortDescription: string;
  longDescription: string|null;
  designatedReporter: Address;
  designatedReportStake: string|number;
  resolutionSource: string|null;
  numTicks: number;
  consensusOutcome: number|null;
  isInvalid: boolean|null;
}

export interface OutcomesRow {
  marketId: Address;
  outcome: number;
  price: string|number;
  sharesOutstanding: string|number;
}

export interface BlocksRow {
  blockNumber: number;
  blockTimestamp: number;
}

export interface UIConsensusInfo {
  outcomeId: number;
  isIndeterminate: boolean;
}

export interface UIOutcomeInfo {
  id: number;
  outstandingShares: string|number;
  price: string|number|null;
}

export interface UIMarketInfo {
  id: Address;
  branchId: Address;
  type: string;
  numOutcomes: number;
  minPrice: string|number;
  maxPrice: string|number;
  cumulativeScale: string|number;
  author: Address;
  creationTime: number;
  creationBlock: number;
  creationFee: string|number;
  marketCreatorFeeRate: string|number;
  marketCreatorFeesCollected: string|number|null;
  category: string;
  tags: Array<string|null>;
  volume: string|number;
  outstandingShares: string|number;
  reportingWindow: Address;
  endDate: number;
  finalizationTime: number|null;
  description: string;
  extraInfo: string|null;
  designatedReporter: Address;
  designatedReportStake: string|number;
  resolutionSource: string|null;
  numTicks: number;
  consensus: UIConsensusInfo|null;
  outcomes: Array<UIOutcomeInfo>;
}

export interface OrdersRow {
  orderId: Bytes32;
  marketId: Address;
  outcome: number;
  shareToken: Address;
  orderType: string;
  orderCreator: Address;
  creationTime: number;
  creationBlockNumber: number;
  price: number|string;
  amount: number|string;
  fullPrecisionPrice: number|string;
  fullPrecisionAmount: number|string;
  tokensEscrowed: number|string;
  sharesEscrowed: number|string;
  betterOrderId: Bytes32|null;
  worseOrderId: Bytes32|null;
  tradeGroupId: Bytes32|null;
}

export interface TradesRow {
  orderType: string;
  marketId: Address;
  outcome: number;
  creator: Address;
  filler: Address;
  price: string|number;
  shares: string|number;
  tradeGroupId: Bytes32|null;
}

export interface JoinedReportsMarketsRow {
  marketId: Address;
  universe: Address;
  reportingWindow: Address;
  reportingToken: Address;
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
  marketId: Address;
  reportingWindow: Address;
  payoutNumerators: Array<string|number|null>;
  amountStaked: string|number;
  reportingToken: Address;
  isCategorical: boolean;
  isScalar: boolean;
  isIndeterminate: boolean;
  isSubmitted: boolean;
}

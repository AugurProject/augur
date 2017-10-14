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
  market_id: string;
}

export interface MarketsRow {
  market_id: Address;
  universe: Address;
  market_type: string;
  num_outcomes: number;
  min_price: string|number;
  max_price: string|number;
  market_creator: Address;
  creation_time: number;
  creation_block_number: number;
  creation_fee: string|number;
  market_creator_fee_rate: string|number;
  market_creator_fees_collected: string|number|null;
  category: string;
  tag1: string|null;
  tag2: string|null;
  volume: string|number;
  shares_outstanding: string|number;
  reporting_window: Address;
  end_time: number;
  finalization_time: number|null;
  short_description: string;
  long_description: string|null;
  designated_reporter: Address;
  designated_report_stake: string|number;
  resolution_source: string|null;
  num_ticks: number;
  consensus_outcome: number|null;
  is_invalid: boolean|null;
}

export interface OutcomesRow {
  market_id: Address;
  outcome: number;
  price: string|number;
  shares_outstanding: string|number;
}

export interface BlocksRow {
  block_number: number;
  block_timestamp: number;
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
  branchID: Address;
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
  order_id: Bytes32;
  market_id: Address;
  outcome: number;
  share_token: Address;
  order_type: string;
  order_creator: Address;
  creation_time: number;
  creation_block_number: number;
  price: number|string;
  amount: number|string;
  full_precision_price: number|string;
  full_precision_amount: number|string;
  tokens_escrowed: number|string;
  shares_escrowed: number|string;
  better_order_id: Bytes32|null;
  worse_order_id: Bytes32|null;
  trade_group_id: Bytes32|null;
}

export interface UITrade {
  type: string;
  price: string;
  shares: string;
  maker: boolean;
}

export interface TradingHistoryTradesRow {
  order_type: string;
  price: string;
  shares: string;
  creator: Address;
}

export interface TradesRow {
  order_type: string;
  market_id: Address;
  outcome: number;
  creator: Address;
  filler: Address;
  price: string|number;
  shares: string|number;
  trade_group_id: Bytes32|null;
}

export interface JoinedReportsMarketsRow {
  market_id: Address;
  universe: Address;
  reporting_window: Address;
  reporting_token: Address;
  market_type: string;
  amount_staked: string|number;
  payout0: string|number|null;
  payout1: string|number|null;
  payout2: string|number|null;
  payout3: string|number|null;
  payout4: string|number|null;
  payout5: string|number|null;
  payout6: string|number|null;
  payout7: string|number|null;
  is_invalid: number;
}

export interface UIReport {
  marketID: Address;
  reportingWindow: Address;
  payoutNumerators: Array<string|number|null>;
  amountStaked: string|number;
  reportingToken: Address;
  isCategorical: boolean;
  isScalar: boolean;
  isIndeterminate: boolean;
  isSubmitted: boolean;
}

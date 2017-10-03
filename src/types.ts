import { Database } from "sqlite3";

export interface EthereumNodeEndpoints {
  [protocol: string]: string
}
export interface UploadBlockNumbers {
  [networkId: string]: number
}

export type AbiEncodedData = string;
export type Address = string;
export type Bytes32 = string;
export type Int256 = string;

export interface Log {
  address: Address,
  topics: Int256[],
  data: AbiEncodedData,
  blockNumber: Int256,
  transactionIndex: Int256,
  transactionHash: Bytes32,
  blockHash: Bytes32,
}

export interface FormattedLog {
  address: Address,
  blockNumber: Int256,
  transactionIndex: Int256,
  transactionHash: Bytes32,
  blockHash: Bytes32,
  [inputName: string]: any
}

export interface AugurLogs {
  [contractName: string]: {
    [eventName: string]: FormattedLog[]
  }
}

export type ErrorCallback = (err?: Error|null) => void;

export type LogProcessor = (db: Database, log: FormattedLog, callback: ErrorCallback) => void;

export interface MarketInfo {
  contractAddress: Address,
  universe: Address,
  marketType: string,
  numOutcomes: number,
  minPrice: number,
  maxPrice: number,
  marketCreator: Address,
  creationTime: number,
  creationBlockNumber: number,
  creationFee: number,
  marketCreatorFeeRate: number,
  marketCreatorFeesCollected: number|null,
  topic: string,
  tag1: string|null,
  tag2: string|null,
  volume: number,
  sharesOutstanding: number,
  reportingWindow: Address,
  endTime: number,
  finalizationTime: number|null,
  shortDescription: string,
  longDescription: string|null,
  designatedReporter: Address,
  resolutionSource: string|null
}

export interface MarketsRow {
  contract_address: Address,
  universe: Address,
  market_type: string,
  num_outcomes: number,
  min_price: number,
  max_price: number,
  market_creator: Address,
  creation_time: number,
  creation_block_number: number,
  creation_fee: number,
  market_creator_fee_rate: number,
  market_creator_fees_collected: number|null,
  topic: string,
  tag1: string|null,
  tag2: string|null,
  volume: number,
  shares_outstanding: number,
  reporting_window: Address,
  end_time: number,
  finalization_time: number|null,
  short_description: string,
  long_description: string|null,
  designated_reporter: Address,
  resolution_source: string|null
}

export interface TransferRow {
  transaction_hash: Bytes32,
  log_index: number,
  sender: Address,
  recipient: Address,
  token: Address,
  value: number,
  block_number: number
}

export interface TransferLog {
  transactionHash: Bytes32,
  logIndex: number,
  sender: Address,
  recipient: Address,
  token: Address,
  value: number,
  blockNumber: number
}

export type TransferHistory = TransferLog[];

export interface JsonRpcRequest {
  jsonrpc: string,
  id: string|number,
  method: string,
  params: any
}

export interface JsonRpcResponse {
  jsonrpc: string,
  result: any
}

export interface GetMarketInfoRequest {
  jsonrpc: string,
  id: string|number,
  method: string,
  params: {
    market: string
  }
}

export interface GetAccountTransferHistoryRequest {
  jsonrpc: string,
  id: string|number,
  method: string,
  params: {
    account: Address,
    token: Address|null
  }
}

import * as Knex from "knex";

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

export type LogProcessor = (db: Knex, log: FormattedLog, callback: ErrorCallback) => void;

export interface JsonRpcRequest {
  id: string|number|null,
  jsonrpc: string,
  method: string,
  params: any
}

export interface JsonRpcResponse {
  id: string|number|null,
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

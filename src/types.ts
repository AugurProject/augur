export type AugurJs = any;
export type SqlLiteDb = any;

export interface EthereumNodeEndpoints {
  [protocol: string]: string
}
export interface UploadBlockNumbers {
  [networkId: string]: number
}

export type AbiEncodedData = string;
export type Address = string;
export type Int256 = string;

export interface Log {
  address: Address,
  topics: Int256[],
  data: AbiEncodedData,
  blockNumber: Int256,
  transactionIndex: Int256,
  transactionHash: Int256,
  blockHash: Int256,
}

export interface FormattedLog {
  address: Address,
  blockNumber: Int256,
  transactionIndex: Int256,
  transactionHash: Int256,
  blockHash: Int256,
  [inputName: string]: any
}

export interface AugurLogs {
  [contractName: string]: {
    [eventName: string]: FormattedLog[]
  }
}

export type ErrorCallback = (err?: Error|null) => void;

export type LogProcessor = (db: SqlLiteDb, log: FormattedLog, callback: ErrorCallback) => void;

export interface Log {
  blockNumber?: number;
  blockHash?: string;
  transactionIndex?: number;
  removed?: boolean;
  transactionLogIndex?: number;
  address: string;
  data: string;
  topics: Array<string>;
  transactionHash?: string;
  logIndex?: number;
}

export interface LogValues {
  [paramName: string]: any;
}

export interface ParsedLog {
  blockNumber?: number;
  blockHash?: string;
  transactionIndex?: number;
  removed?: boolean;
  transactionLogIndex?: number;
  transactionHash?: string;
  logIndex?: number;
  [paramName: string]: any;
}

export interface Filter {
  fromBlock: number|string;
  toBlock: number|string;
  address?: string;
  topics?: Array<string | Array<string>>;
}

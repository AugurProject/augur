export interface Log {
  name: string;
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;
  removed: boolean;
  transactionLogIndex: number;
  address: string;
  data: string;
  topics: string[];
  transactionHash: string;
  logIndex: number;
}

export interface LogValues {
  [paramName: string]: any;
}

export interface ParsedLog {
  name: string;
  address: string;
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;
  removed: boolean;
  transactionLogIndex: number;
  transactionHash: string;
  logIndex: number;
  topics?: Array<string | string[]>;
  [paramName: string]: any;
}

export interface Filter {
  blockhash?: string;
  fromBlock?: number | string;
  toBlock?: number | string;
  address?: string;
  topics?: Array<string | string[]>;
}

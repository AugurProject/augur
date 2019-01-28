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

export interface Filter {
  fromBlock: number|string;
  toBlock: number|string;
  address?: string;
  topics?: string[];
}

// TODO Generate these from augur-core
export interface MarketCreatedLog extends Log {
  topic: string,
  description: string,
  extraInfo: string,
  universe: string,
  market: string,
  marketCreator: string,
  outcomes: Array<string>,
  marketCreationFee: string,
  minPrice: string,
  maxPrice: string,
  marketType: number,
}
export interface OrderCreatedLog extends Log {
  orderType: number,
  amount: string,
  price: string,
  creator: string,
  moneyEscrowed: string,
  sharesEscrowed: string,
  tradeGroupId: string,
  orderId: string,
  universe: string,
  shareToken: string
}

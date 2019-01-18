export interface Log {
}

export interface Filter {
  fromBlock: number|string;
  toBlock: number|string;
  address?: string;
  topics?: string[];
}

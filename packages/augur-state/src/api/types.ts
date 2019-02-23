import { Log } from "ethereumjs-blockstream";

export interface SortLimit {
    sortBy?: string;
    isSortDescending?: boolean;
    limit?: number;
    offset?: number;
}

export interface ExtendedLog extends Log {
    transactionIndex?: number;
    removed?: boolean;
    transactionLogIndex?: number;
    address: string;
    data: string;
    topics: Array<string>;
    transactionHash?: string;
}

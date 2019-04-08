import { string, number } from "prop-types";

export interface Log {
    blockNumber: number;
    blockHash: string;
    transactionIndex: number;
    transactionHash: string;
    logIndex: number;
    timestamp: number;
}

export interface OrderFilledLog extends Log {
    universe: string;
    filler: string;
    creator: string;
    marketId: string;
    orderId: string;
    marketCreatorFees: string;
    reporterFees: string;
    amountFilled: string;
    outcome: string;
    tradeGroupId: string;
}

export interface OrderCreatedLog extends Log {
    orderType: number;
    amount: string;
    price: string;
    creator: string;
    tradeGroupId: string;
    orderId: string;
    universe: string;
    marketId: string;
    kycToken: string;
    outcome: string;
}

export interface MarketCreatedLog extends Log {
    universe: string;
    endTime: string;
    topic: string;
    description: string;
    extraInfo: string;
    market: string;
    marketCreator: string;
    minPrice: string;
    maxPrice: string;
    marketType: string;
    numTicks: string;
    outcomes: Array<string>;
}

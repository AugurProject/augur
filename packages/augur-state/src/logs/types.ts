import { string, number } from "prop-types";

export interface Log {
    blockNumber: number;
    blockHash: string;
    transactionIndex: number;
    transactionHash: string;
    logIndex: number;
}

export interface Doc {
    _id: string;
    _rev: string;
}

export interface OrderFilledLog extends Log, Doc {
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
    price: string;
}

export interface OrderCreatedLog extends Log, Doc {
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

export interface MarketCreatedLog extends Log, Doc {
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

export interface ProfitLossChangedLog extends Log, Doc {
    universe: string;
    market: string;
    account: string;
    outcome: string;
    netPosition: string;
    avgPrice: string;
    realizedProfit: string;
    frozenFunds: string;
    realizedCost: string;
    timestamp: string;
}

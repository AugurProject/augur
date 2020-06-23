import { Address, OrderState } from './logs';

export interface MarketTrade {
  transactionHash: string;
  logIndex: number;
  orderId: string;
  type: string;
  price: string;
  amount: string;
  maker: boolean | null;
  selfFilled: boolean;
  settlementFees: string;
  marketId: string;
  outcome: number;
  timestamp: number;
  tradeGroupId: string | null;
  creator: string;
  filler: string;
}

export interface MarketTradingHistory {
  [marketId: string]: MarketTrade[];
}

export interface Order {
  orderId: string;
  transactionHash: string;
  logIndex: number;
  owner: string;
  orderState: OrderState;
  price: string;
  amount: string;
  amountFilled: string;
  fullPrecisionPrice: string;
  fullPrecisionAmount: string;
  tokensEscrowed: string; // TODO add to log
  sharesEscrowed: string; // TODO add to log
  canceledBlockNumber?: string;
  canceledTransactionHash?: string;
  canceledTime?: string;
  creationTime: number;
  creationBlockNumber: number;
  originalFullPrecisionAmount: string;
}

export interface Orders {
  [marketId: string]: {
    [outcome: number]: {
      [orderType: string]: {
        [orderId: string]: Order;
      };
    };
  };
}

export interface AllOrders {
  [orderId: string]: {
    orderId: Address;
    tokensEscrowed: string;
    sharesEscrowed: string;
    marketId: Address;
  };
}

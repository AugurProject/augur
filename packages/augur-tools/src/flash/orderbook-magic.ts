import { MarketOrderBook } from "@augurproject/sdk/src/state/getter/Markets";
import { ContractAPI } from "../libs/contract-api";

const config: OrderBookConfig = {
  bids: [
    {
      price: 0.45,
      vol: 1000,
    },
  ],
  asks: [
    {
      price: 0.55,
      vol: 1000,
    },
  ],
};

interface OrderBookSize {
  price: number;
  vol: number;
}
interface OrderBookConfig {
  bids: OrderBookSize[];
  asks: OrderBookSize[];
}
// orderbook: MarketOrderBook

export const getCurrentUserOrders = async (user: ContractAPI, marketId: string) => {
  const account = user.account.publicKey
  const result = await user.augur.getMarketOrderBook({ marketId, account});

}


export const createMissingOrders = () => {

}


export const checkAndPopulateOrderbook = (config: OrderBookConfig) => {

}

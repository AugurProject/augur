import { MarketOrderBook, MarketOrderBookOrder } from "@augurproject/sdk/src/state/getter/Markets";
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from "ethers/utils";
import { ZeroXPlaceTradeDisplayParams } from "@augurproject/sdk/src";

const config: OrderBookConfig = {
  bids: {
    0.45: 100,
    0.4: 200,
    0.35: 300,
    0.3: 400,
    0.25: 500,
    0.2: 600,
    0.15: 700,
    0.1: 800,
  },
  asks: {
    0.55: 100,
    0.6: 200,
    0.65: 300,
    0.7: 400,
    0.75: 500,
    0.8: 600,
    0.85: 700,
    0.9: 800,
  },
};
interface MarketOutcomesBook {
  [outcome: number] : OrderBookConfig;
}
interface OrderPriceVol {
  [price: number]: number;
}
interface OrderBookConfig {
  bids: OrderPriceVol;
  asks: OrderPriceVol;
}

interface BidsAsks {
  bids: MarketOrderBookOrder[];
  asks: MarketOrderBookOrder[];
}

interface SimpleOrder {
  outcome: number;
  price: string;
  quantity: number;
  direction: number;
}
const orderType = {
  'bids': 0,
  'asks': 1
}

export class OrderBookShaper {
  marketId: string = "";
  orderSize: number = 100;
  outcomes: number[] = [];
  maxPrice: BigNumber = new BigNumber(1);
  minPrice: BigNumber = new BigNumber(0);
  numTicks: BigNumber = new BigNumber(100);
  numOutcomes: 3;
  fiveMinutesInSeconds = new BigNumber(18000);

  constructor (marketId: string, outcomes: number[] = [1, 2]) {
    this.marketId = marketId;
    this.outcomes = outcomes;
  }

  nextRun = (marketBook: MarketOrderBook, timestamp: BigNumber): ZeroXPlaceTradeDisplayParams[] => {
    const marketOutcomesBook: MarketOutcomesBook = this.outcomes.reduce((p, o) => ({...p, [o]: config}), {})
    const currentConfig = JSON.parse(JSON.stringify(marketOutcomesBook));
    const orderBook = marketBook.orderBook;
    let orders: SimpleOrder[] = [];
    this.outcomes.map(o => {
      orders = [...orders, ...this.createMissingOrders(o, currentConfig[o], orderBook[o])];
    })

    return this.createOrders(orders, timestamp);
  }

  createMissingOrders = (outcome: number, orderBookConfig: OrderBookConfig, bidsAsks: BidsAsks): SimpleOrder[] => {
    let orders: SimpleOrder[] = []
    Object.keys(orderBookConfig).map(type => {
      const direction = orderType[type];
      const priceVol: OrderPriceVol = orderBookConfig[type];
      const bookPriceVol: MarketOrderBookOrder[] = bidsAsks ? bidsAsks[type] : [];
      Object.keys(priceVol).map((price: string) => {
        const value = bookPriceVol.find(b => b.price === price);
        const minVolume = priceVol[price];
        const createMoreOrders = !value || new BigNumber(value.shares).lt(new BigNumber(minVolume));
        const quantity = !value ? new BigNumber(minVolume) : new BigNumber(minVolume).minus(new BigNumber(value.shares))
        if (createMoreOrders) {
          const numCreateOrders = quantity.dividedBy(this.orderSize).toNumber();
          for(let i = 0; i < numCreateOrders; i++) {
            orders.push({outcome, quantity: this.orderSize, price, direction})
          }
        }
      })
    })
    return orders;
  }


  createOrders = (orders: SimpleOrder[], timestamp: BigNumber): ZeroXPlaceTradeDisplayParams[] => {
    const zOrders = orders.map(order => {
      const tradeGroupId = String(Date.now());

      const expirationTime = timestamp.plus(this.fiveMinutesInSeconds);
      return {
        direction: order.direction as 0 | 1,
        market: this.marketId,
        numTicks: this.numTicks,
        numOutcomes: this.numOutcomes,
        outcome: order.outcome as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
        tradeGroupId,
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: this.minPrice,
        displayMaxPrice: this.maxPrice,
        displayAmount: new BigNumber(order.quantity),
        displayPrice: new BigNumber(order.price),
        displayShares: new BigNumber(0),
        expirationTime,
      };
    })
    return zOrders;
  }
}


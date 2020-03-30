import {
  MarketOrderBook,
  MarketOrderBookOrder,
  OutcomeOrderBook
} from "@augurproject/sdk/src/state/getter/Markets";
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import { ZeroXPlaceTradeDisplayParams } from '@augurproject/sdk/src';

const looseOrderBookConfig: OrderBookConfig = {
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
export interface OrderPriceVol {
  [price: number]: number; // price -> volume
}
export interface OrderBookConfig {
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

const ORDER_TYPE = {
  'bids': 0,
  'asks': 1
}

export class OrderBookShaper {
  readonly maxPrice: BigNumber = new BigNumber(1);
  readonly minPrice: BigNumber = new BigNumber(0);
  readonly numTicks: BigNumber = new BigNumber(100);
  readonly minAllowedSize: BigNumber = new BigNumber(100);
  readonly numOutcomes: 3;

  constructor (
    public marketId: string,
    public orderSize: number = null,
    public expiration: BigNumber = new BigNumber(300),
    public outcomes: number[] = [2, 1],
    public orderBookConfig: OrderBookConfig = looseOrderBookConfig
  ) {}

  nextRun = (orderBook: OutcomeOrderBook, timestamp: BigNumber): ZeroXPlaceTradeDisplayParams[] => {
    const marketOutcomesBook: MarketOutcomesBook = this.outcomes.reduce((p, o) => ({...p, [o]: this.orderBookConfig}), {})
    let orders: SimpleOrder[] = [];
    this.outcomes.forEach((o: number) => {
      orders = [...orders, ...this.createMissingOrders(o, marketOutcomesBook[o], orderBook[o])];
    })
    return this.createOrders(orders, timestamp);
  }

  createMissingOrders2 = (outcome: number, orderBookConfig: OrderBookConfig): SimpleOrder[] => {
    const orders: SimpleOrder[] = []
    console.log(`no bids asks for ${this.marketId}`);
    Object.keys(orderBookConfig).forEach((type: string) => {
      const priceVol: OrderPriceVol = orderBookConfig[type];
      const direction = ORDER_TYPE[type];
      Object.keys(priceVol).forEach((price: string) => {
        const quantity = priceVol[price]; // aka volume
        orders.push({ outcome, direction, price, quantity });
      });
    })
    return orders;
  }

  createMissingOrders = (outcome: number, orderBookConfig: OrderBookConfig, bidsAsks: BidsAsks): SimpleOrder[] => {
    const orders: SimpleOrder[] = []
    if (!bidsAsks) console.log(`no bids asks for ${this.marketId}`);
    Object.keys(orderBookConfig).forEach((type: string) => {
      const direction = ORDER_TYPE[type];
      const priceVol: OrderPriceVol = orderBookConfig[type];
      const bookPriceVol: MarketOrderBookOrder[] = bidsAsks ? bidsAsks[type] : [];
      Object.keys(priceVol).forEach((price: string) => {
        const value = bookPriceVol.find(b => String(b.price) === String(price));
        const minVolume = priceVol[price];
        const createMoreOrders = !value || new BigNumber(value.shares).lt(new BigNumber(this.minAllowedSize));
        const quantity = !value ? new BigNumber(minVolume) : new BigNumber(minVolume).minus(new BigNumber(value.shares))
        if (createMoreOrders) {
          const numCreateOrders = this.orderSize ? quantity.dividedBy(this.orderSize).toNumber() : 1;
          for (let i = 0; i < numCreateOrders; i++) {
            orders.push({
              outcome,
              quantity: this.orderSize || quantity.toNumber(),
              price,
              direction,
            });
          }
        }
      })
    })
    return orders;
  }

  createOrders = (orders: SimpleOrder[], timestamp: BigNumber): ZeroXPlaceTradeDisplayParams[] => {
    return orders.map(order => {
      return {
        direction: order.direction as 0 | 1,
        market: this.marketId,
        numTicks: this.numTicks,
        numOutcomes: this.numOutcomes,
        outcome: order.outcome as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: this.minPrice,
        displayMaxPrice: this.maxPrice,
        displayAmount: new BigNumber(order.quantity),
        displayPrice: new BigNumber(order.price),
        displayShares: new BigNumber(0),
        tradeGroupId: String(Date.now()),
        expirationTime: timestamp.plus(this.expiration),
      };
    });
  }
}


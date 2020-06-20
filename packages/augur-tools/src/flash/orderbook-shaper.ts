import {
  MarketInfo,
  MarketOrderBook,
  MarketOrderBookOrder,
  OutcomeOrderBook,
} from '@augurproject/sdk-lite';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import { ZeroXPlaceTradeDisplayParams } from '@augurproject/sdk';
import { ContractAPI } from '..';
import { sleep } from './util';

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
  readonly minAllowedSize: BigNumber = new BigNumber(100);

  constructor (
    public marketInfo: MarketInfo,
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

  createMissingOrders = (outcome: number, orderBookConfig: OrderBookConfig, bidsAsks: BidsAsks): SimpleOrder[] => {
    const orders: SimpleOrder[] = []
    if (!bidsAsks) console.log(`no bids asks for ${this.marketInfo.id}`);
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
        market: this.marketInfo.id,
        numTicks: new BigNumber(this.marketInfo.numTicks),
        numOutcomes: this.marketInfo.numOutcomes,
        outcome: order.outcome as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
        fingerprint: formatBytes32String('11'),
        doNotCreateOrders: false,
        displayMinPrice: new BigNumber(this.marketInfo.minPrice),
        displayMaxPrice: new BigNumber(this.marketInfo.maxPrice),
        displayAmount: new BigNumber(order.quantity),
        displayPrice: new BigNumber(order.price),
        displayShares: new BigNumber(0),
        tradeGroupId: String(Date.now()),
        expirationTime: timestamp.plus(this.expiration),
      };
    });
  }
}

export async function simpleOrderbookShaper(
  user: ContractAPI,
  marketInfos: MarketInfo[],
  intervalMS: number,
  orderSize: number,
  expiration: BigNumber
) {
  const orderBooks = marketInfos.map(m => new OrderBookShaper(m, orderSize, expiration));
  while (true) {
    const timestamp = await user.getTimestamp();
    for (let i = 0; i < orderBooks.length; i++) {
      const orderBook: OrderBookShaper = orderBooks[i];
      const { id: marketId } = orderBook.marketInfo;
      const marketBook: MarketOrderBook = await user.augur.getMarketOrderBook(
        { marketId }
      );
      const orders = orderBook.nextRun(marketBook.orderBook, new BigNumber(timestamp));
      if (orders.length > 0) {
        console.log(`creating ${orders.length} orders for ${marketId}`);
        orders.map(order => console.log(`Creating ${order.displayAmount} at ${order.displayPrice} on outcome ${order.outcome}`));
        await user.placeZeroXOrders(orders).catch(console.log);
      }
    }
    await sleep(intervalMS);
  }
}

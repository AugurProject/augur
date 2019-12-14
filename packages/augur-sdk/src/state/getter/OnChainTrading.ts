import { sortOptions } from "./types";
import { DB } from "../db/DB";
import * as _ from "lodash";
import {
  Augur,
  convertDisplayPriceToOnChainPrice,
  convertOnChainAmountToDisplayAmount,
  convertOnChainPriceToDisplayPrice,
  numTicksToTickSize,
} from "../../index";
import { BigNumber } from "bignumber.js";
import { Getter } from "./Router";
import {
  Address,
  OrderEventType,
  ParsedOrderEventLog,
  MarketData,
} from "../logs/types";

import * as t from "io-ts";
import Dexie from "dexie";

const ZERO = new BigNumber(0);

const TradingHistoryParams = t.partial({
  universe: t.string,
  account: t.string,
  marketIds: t.array(t.string),
  outcome: t.number,
  filterFinalized: t.boolean,
});

export const OutcomeParam = t.keyof({
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
  7: null,
});

export const makerTakerValues = {
  'either': 'either',
  'maker': 'maker',
  'taker': 'taker',
};

export const makerTaker = t.keyof(makerTakerValues);

export const OrdersParams = t.partial({
  universe: t.string,
  marketId: t.string,
  outcome: OutcomeParam,
  orderType: t.string,
  account: t.string,
  orderState: t.string,
  filterFinalized: t.boolean,
  makerTaker
});

export interface MarketTradingHistory {
  [marketId: string]: MarketTrade[];
}

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

export enum OrderState {
  ALL = 'ALL',
  OPEN = 'OPEN',
  FILLED = 'FILLED',
  CANCELED = 'CANCELED',
}

export interface AllOrders {
  [orderId: string]: {
    orderId: Address;
    tokensEscrowed: string;
    sharesEscrowed: string;
    marketId: Address;
  };
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
  kycToken?: string;
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

export const OrderType = t.keyof({
  buy: null,
  sell: null,
});

export const BetterWorseOrdersParams = t.type({
  marketId: t.string,
  outcome: t.number,
  orderType: OrderType,
  price: t.number,
});

export interface BetterWorseResult {
  betterOrderId: string | null;
  worseOrderId: string | null;
}

export class OnChainTrading {
  static GetTradingHistoryParams = t.intersection([
    sortOptions,
    TradingHistoryParams,
  ]);
  static GetAllOrdersParams = t.partial({
    account: t.string,
    filterFinalized: t.boolean,
  });
  static GetOrdersParams = t.intersection([sortOptions, OrdersParams]);
  static GetBetterWorseOrdersParams = BetterWorseOrdersParams;

  @Getter('GetTradingHistoryParams')
  static async getTradingHistory(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof OnChainTrading.GetTradingHistoryParams>
  ): Promise<MarketTradingHistory> {
    if (!params.account && params.marketIds.length === 0) {
      throw new Error(
        "'getTradingHistory' requires an 'account' or 'marketIds' param be provided"
      );
    }

    let orderFilledCollection: Dexie.Collection<ParsedOrderEventLog, any>;
    if (params.marketIds) {
      orderFilledCollection = db.OrderEvent.where("market").anyOf(params.marketIds);
    } else {
      orderFilledCollection = db.OrderEvent.where("orderCreator").equals(params.account).or("orderFiller").equals(params.account);
    }

    const formattedOutcome = params.outcome ? `0x${params.outcome.toString(16)}` : "";

    orderFilledCollection = orderFilledCollection.and((log) => {
      if (log.eventType !== OrderEventType.Fill) return false;
      if (params.universe && log.universe !== params.universe) return false;
      if (params.outcome && log.outcome !== formattedOutcome) return false;
      return true;
    });
    if (params.limit) orderFilledCollection = orderFilledCollection.limit(params.limit);
    if (params.offset) orderFilledCollection = orderFilledCollection.offset(params.offset);
    const orderFilledResponse = await orderFilledCollection.toArray();

    const orderIds = _.map(orderFilledResponse, 'orderId');
    const ordersResponse = await db.OrderEvent.where("orderId").anyOf(orderIds).toArray();
    const orders = _.keyBy(ordersResponse, 'orderId');

    const marketIds = _.map(orderFilledResponse, 'market');
    const markets = await getMarkets(
      marketIds,
      db,
      params.filterFinalized
    );

    return orderFilledResponse.reduce(
      (trades: MarketTradingHistory, orderFilledDoc) => {
        const orderDoc = orders[orderFilledDoc.orderId];
        if (!orderDoc) return trades;
        const marketDoc = markets[orderFilledDoc.market];
        if (!marketDoc) return trades;
        const isMaker: boolean | null =
          params.account === null
            ? false
            : params.account === orderFilledDoc.orderCreator;
        const orderType = orderDoc.orderType === 0 ? 'buy' : 'sell';
        const fees = new BigNumber(orderFilledDoc.fees);
        const minPrice = new BigNumber(marketDoc.prices[0]);
        const maxPrice = new BigNumber(marketDoc.prices[1]);
        const numTicks = new BigNumber(marketDoc.numTicks);
        const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
        const amount = convertOnChainAmountToDisplayAmount(
          new BigNumber(orderFilledDoc.amountFilled, 16),
          tickSize
        );
        const price = convertOnChainPriceToDisplayPrice(
          new BigNumber(orderFilledDoc.price, 16),
          minPrice,
          tickSize
        );
        if (typeof trades[orderFilledDoc.market] === 'undefined') {
          trades[orderFilledDoc.market] = [];
        }
        trades[orderFilledDoc.market].push(Object.assign(
          _.pick(orderFilledDoc, [
            'transactionHash',
            'logIndex',
            'orderId',
            'tradeGroupId',
          ]),
          {
            marketId: orderFilledDoc.market,
            outcome: new BigNumber(orderFilledDoc.outcome).toNumber(),
            maker: isMaker,
            type: isMaker ? orderType : orderType === 'buy' ? 'sell' : 'buy',
            selfFilled:
              orderFilledDoc.orderCreator === orderFilledDoc.orderFiller,
            price: price.toString(10),
            amount: amount.toString(10),
            settlementFees: fees.toString(10),
            timestamp: new BigNumber(orderFilledDoc.timestamp).toNumber(),
            creator: orderFilledDoc.orderCreator,
            filler: orderFilledDoc.orderFiller,
          }
        ) as MarketTrade);
        return trades;
      },
      {} as MarketTradingHistory
    );
  }

  @Getter('GetOrdersParams')
  static async getOrders(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof OnChainTrading.GetOrdersParams>
  ): Promise<Orders> {
    if (!params.marketId && !params.universe) {
      throw new Error(
        "'getOrders' requires a 'marketId' or 'universe' param be provided"
      );
    }

    let currentOrdersResponse: ParsedOrderEventLog[];

    if (params.universe) {
      currentOrdersResponse = await db.CurrentOrders.where('orderCreator').equals(params.account).or('orderFiller').equals(params.account).and((log) => {
        return log.universe === params.universe;
      }).and((log) => {
        if (params.orderState === OrderState.OPEN && log.amount === "0x00") return false;
        if (params.orderState === OrderState.CANCELED && log.eventType !== OrderEventType.Cancel) return false;
        if (params.orderState === OrderState.FILLED && log.eventType !== OrderEventType.Fill) return false;
        return true;
      }).toArray();
    } else {
      currentOrdersResponse = await db.CurrentOrders.where('[market+outcome+orderType]').between([
        params.marketId,
        params.outcome ? `0x0${params.outcome}` : Dexie.minKey,
        params.orderType ? params.orderType : Dexie.minKey
      ], [
        params.marketId,
        params.outcome ? `0x0${params.outcome}` : Dexie.maxKey,
        params.orderType ? params.orderType : Dexie.maxKey
      ]).and((log) => {
        if (params.account) {
          if (log.orderCreator != params.account && log.orderFiller != params.account) return false;
        }

        if (params.orderState === OrderState.OPEN && log.amount === "0x00") return false;
        if (params.orderState === OrderState.CANCELED && log.eventType !== OrderEventType.Cancel) return false;
        if (params.orderState === OrderState.FILLED && log.eventType !== OrderEventType.Fill) return false;

        return true;
      }).toArray();
    }

    const orderIds = _.map(currentOrdersResponse, 'orderId');
    const originalOrdersResponse = await db.OrderEvent.where("orderId").anyOf(orderIds).and((log) => log.eventType === OrderEventType.Create).toArray();
    const originalOrders = _.keyBy(originalOrdersResponse, 'orderId');

    const marketIds = _.map(currentOrdersResponse, 'market');
    const markets = await getMarkets(
      marketIds,
      db,
      params.filterFinalized
    );

    return currentOrdersResponse.reduce(
      (orders: Orders, orderEventDoc: ParsedOrderEventLog) => {
        const marketDoc = markets[orderEventDoc.market];
        if (!marketDoc) return orders;
        const originalOrderDoc = originalOrders[orderEventDoc.orderId];
        const minPrice = new BigNumber(marketDoc.prices[0]);
        const maxPrice = new BigNumber(marketDoc.prices[1]);
        const numTicks = new BigNumber(marketDoc.numTicks);
        const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
        const amount = convertOnChainAmountToDisplayAmount(
          new BigNumber(orderEventDoc.amount, 16),
          tickSize
        ).toString(10);
        const amountFilled = convertOnChainAmountToDisplayAmount(
          new BigNumber(orderEventDoc.amountFilled, 16),
          tickSize
        ).toString(10);
        const price = convertOnChainPriceToDisplayPrice(
          new BigNumber(orderEventDoc.price, 16),
          minPrice,
          tickSize
        ).toString(10);
        const market = orderEventDoc.market;
        const outcome = new BigNumber(orderEventDoc.outcome).toNumber();
        const orderType = orderEventDoc.orderType;
        const orderId = orderEventDoc.orderId;
        const sharesEscrowed = convertOnChainAmountToDisplayAmount(
          new BigNumber(orderEventDoc.sharesEscrowed, 16),
          tickSize
        ).toString(10);
        const tokensEscrowed = new BigNumber(orderEventDoc.tokensEscrowed, 16)
        .dividedBy(10 ** 18)
        .toString(10);
        let orderState = OrderState.OPEN;
        if (orderEventDoc.eventType === OrderEventType.Fill) {
          orderState = OrderState.FILLED;
        }
        if (orderEventDoc.eventType === OrderEventType.Cancel) {
          orderState = OrderState.CANCELED;
        }
        if (!orders[market]) orders[market] = {};
        if (!orders[market][outcome]) orders[market][outcome] = {};
        if (!orders[market][outcome][orderType]) {
          orders[market][outcome][orderType] = {};
        }
        orders[market][outcome][orderType][orderId] = Object.assign(
          _.pick(orderEventDoc, ['transactionHash', 'logIndex', 'orderId']),
          {
            owner: orderEventDoc.orderCreator,
            orderState,
            price,
            amount,
            amountFilled,
            fullPrecisionPrice: price,
            fullPrecisionAmount: amount,
            tokensEscrowed,
            sharesEscrowed,
            canceledBlockNumber:
              orderEventDoc.eventType === OrderEventType.Cancel
                ? String(orderEventDoc.blockNumber)
                : undefined,
            canceledTransactionHash:
              orderEventDoc.eventType === OrderEventType.Cancel
                ? orderEventDoc.transactionHash
                : undefined,
            canceledTime:
              orderEventDoc.eventType === OrderEventType.Cancel
                ? orderEventDoc.timestamp
                : undefined,
            creationTime: originalOrderDoc ? originalOrderDoc.timestamp : 0,
            creationBlockNumber: originalOrderDoc
              ? originalOrderDoc.blockNumber
              : 0,
            originalFullPrecisionAmount: originalOrderDoc
              ? convertOnChainAmountToDisplayAmount(
                new BigNumber(originalOrderDoc.amount, 16),
                tickSize
              ).toString(10)
              : 0,
          }
        ) as Order;
        return orders;
      },
      {} as Orders
    );
  }
}

export async function getMarkets(
  marketIds: string[],
  db: DB,
  filterFinalized: boolean
) {
  let marketsData: MarketData[];
  if (filterFinalized) {
    marketsData = await db.Markets.where("market").anyOf(marketIds).and((log) => {
      return !log.finalized;
    }).toArray();
  } else {
    marketsData = await db.Markets.where("market").anyOf(marketIds).toArray();
  }
  const markets = _.keyBy(marketsData, 'market');
  return markets;
}

import { SortLimit } from './types';
import { DB } from "../db/DB";
import * as _ from "lodash";
import { Augur, numTicksToTickSize, convertOnChainAmountToDisplayAmount, convertOnChainPriceToDisplayPrice } from "../../index";
import { BigNumber } from "bignumber.js";
import { Getter } from "./Router";
import { ethers } from "ethers";
import { OrderEventLog, OrderEventAddressValue, OrderEventUint256Value, ORDER_EVENT_CREATOR, ORDER_EVENT_FILLER, ORDER_EVENT_OUTCOME, ORDER_EVENT_AMOUNT, ORDER_EVENT_TIMESTAMP } from "../logs/types";

import * as t from "io-ts";

const TradingHistoryParams = t.partial({
  universe: t.string,
  account: t.string,
  marketId: t.string,
  outcome: t.number,
  earliestCreationTime: t.number,
  latestCreationTime: t.number,
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

export const OrdersParams = t.partial({
  universe: t.string,
  marketId: t.string,
  outcome: OutcomeParam,
  orderType: t.string,
  creator: t.string,
  orderState: t.string,
  earliestCreationTime: t.number,
  latestCreationTime: t.number,
});

export interface MarketTradingHistory {
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
}

export enum OrderState {
  ALL = "ALL",
  OPEN = "OPEN",
  FILLED = "FILLED",
  CANCELED = "CANCELED",
}

export interface Order {
  orderId: string;
  transactionHash: string;
  logIndex: number;
  owner: string;
  orderState: OrderState;
  price: string;
  amount: string;
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

export class Trading {
  public static GetTradingHistoryParams = t.intersection([SortLimit, TradingHistoryParams]);
  public static GetOrdersParams = t.intersection([SortLimit, OrdersParams]);

  @Getter("GetTradingHistoryParams")
  public static async getTradingHistory(augur: Augur, db: DB, params: t.TypeOf<typeof Trading.GetTradingHistoryParams>): Promise<Array<any>> {
    if (!params.account && !params.marketId) {
      throw new Error("'getTradingHistory' requires an 'account' or 'marketId' param be provided");
    }
    const request = {
      selector: {
        universe: params.universe,
        market: params.marketId,
        [ORDER_EVENT_OUTCOME]: params.outcome,
        $or: [
          { [ORDER_EVENT_CREATOR] : params.account },
          { [ORDER_EVENT_FILLER]: params.account },
        ],
      },
      sort: params.sortBy ? [params.sortBy] : undefined,
      limit: params.limit,
      skip: params.offset,
    };

    const orderFilledResponse = await db.findOrderFilledLogs(request);

    const orderIds = _.map(orderFilledResponse, "orderId");

    const ordersResponse = await db.findOrderCreatedLogs({ selector: { orderId: { $in: orderIds } } });
    const orders = _.keyBy(ordersResponse, "orderId");

    const marketIds = _.map(orderFilledResponse, "market");

    const marketsResponse = await db.findMarketCreatedLogs({ selector: { market: { $in: marketIds } } });
    const markets = _.keyBy(marketsResponse, "market");

    return orderFilledResponse.reduce((trades: Array<MarketTradingHistory>, orderFilledDoc) => {
      const orderDoc = orders[orderFilledDoc.orderId];
      if (!orderDoc) return trades;
      const marketDoc = markets[orderFilledDoc.market];
      if (!marketDoc) return trades;
      const isMaker: boolean | null = params.account == null ? false : params.account === orderFilledDoc.addressData[OrderEventAddressValue.orderCreator];
      const orderType = orderDoc.orderType === 0 ? "buy" : "sell";
      const fees = new BigNumber(orderFilledDoc.uint256Data[OrderEventUint256Value.fees]);
      const minPrice = new BigNumber(marketDoc.prices[0]);
      const maxPrice = new BigNumber(marketDoc.prices[1]);
      const numTicks = new BigNumber(marketDoc.numTicks);
      const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
      const amount = convertOnChainAmountToDisplayAmount(new BigNumber(orderFilledDoc.uint256Data[OrderEventUint256Value.amountFilled], 16), tickSize);
      const price = convertOnChainPriceToDisplayPrice(new BigNumber(orderFilledDoc.uint256Data[OrderEventUint256Value.price], 16), minPrice, tickSize);
      trades.push(Object.assign(_.pick(orderFilledDoc, [
        "transactionHash",
        "logIndex",
        "orderId",
        "tradeGroupId",
      ]), {
          marketId: orderFilledDoc.market,
          outcome: new BigNumber(orderFilledDoc.uint256Data[OrderEventUint256Value.outcome]).toNumber(),
          maker: isMaker,
          type: isMaker ? orderType : (orderType === "buy" ? "sell" : "buy"),
          selfFilled: orderFilledDoc.addressData[OrderEventAddressValue.orderCreator] === orderFilledDoc.addressData[OrderEventAddressValue.orderFiller],
          price: price.toString(10),
          amount: amount.toString(10),
          settlementFees: fees.toString(10),
        }) as MarketTradingHistory);
      return trades;
    }, [] as Array<MarketTradingHistory>);
  }

  @Getter("GetOrdersParams")
  public static async getOrders<TBigNumber>(augur: Augur<ethers.utils.BigNumber>, db: DB<TBigNumber>, params: t.TypeOf<typeof Trading.GetOrdersParams>): Promise<Orders> {
    if (!params.universe && !params.marketId) {
      throw new Error("'getOrders' requires a 'universe' or 'marketId' param be provided");
    }
    const request = {
      selector: {
        universe: params.universe,
        market: params.marketId,
        [ORDER_EVENT_OUTCOME]: params.outcome,
        orderType: params.orderType,
        [ORDER_EVENT_CREATOR] : params.creator,
      },
      sort: params.sortBy ? [params.sortBy] : undefined,
      limit: params.limit,
      skip: params.offset,
    };

    if (params.orderState === "OPEN") request.selector = Object.assign(request.selector, {[ORDER_EVENT_AMOUNT] : { $gt: "0x00"}});
    if (params.orderState === "CANCELED") request.selector = Object.assign(request.selector, {"eventType" : 1});
    if (params.orderState === "FILLED") request.selector = Object.assign(request.selector, {"eventType" : 3});

    if (params.latestCreationTime && params.earliestCreationTime) {
      request.selector = Object.assign(request.selector, {
        $and: [
          { [ORDER_EVENT_TIMESTAMP]: { $lte: `0x${params.latestCreationTime.toString(16)}` } },
          { [ORDER_EVENT_TIMESTAMP]: { $gte: `0x${params.earliestCreationTime.toString(16)}` } }
        ]
      });
    } else if (params.latestCreationTime) {
      request.selector = Object.assign(request.selector, {[ORDER_EVENT_TIMESTAMP]: { $lte: `0x${params.latestCreationTime.toString(16)}` }});
    } else if (params.earliestCreationTime) {
      request.selector = Object.assign(request.selector, {[ORDER_EVENT_TIMESTAMP]: { $gte: `0x${params.earliestCreationTime.toString(16)}` }});
    }

    const currentOrdersResponse = await db.findCurrentOrders(request);

    const orderIds = _.map(currentOrdersResponse, "orderId");
    const originalOrdersResponse = await db.findOrderCreatedLogs({ selector: { orderId: { $in: orderIds } } });
    const originalOrders = _.keyBy(originalOrdersResponse, "orderId");

    const marketIds = _.map(currentOrdersResponse, "market");
    const marketsResponse = await db.findMarketCreatedLogs({ selector: { market: { $in: marketIds } } });
    const markets = _.keyBy(marketsResponse, "market");

    return currentOrdersResponse.reduce((orders: Orders, orderEventDoc: OrderEventLog) => {
      const marketDoc = markets[orderEventDoc.market];
      if (!marketDoc) return orders;
      const originalOrderDoc = originalOrders[orderEventDoc.orderId];
      const minPrice = new BigNumber(marketDoc.prices[0]);
      const maxPrice = new BigNumber(marketDoc.prices[1]);
      const numTicks = new BigNumber(marketDoc.numTicks);
      const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
      const amount = convertOnChainAmountToDisplayAmount(new BigNumber(orderEventDoc.uint256Data[OrderEventUint256Value.amountFilled], 16), tickSize).toString(10);
      const price = convertOnChainPriceToDisplayPrice(new BigNumber(orderEventDoc.uint256Data[OrderEventUint256Value.price], 16), minPrice, tickSize).toString(10);
      const market = orderEventDoc.market;
      const outcome = new BigNumber(orderEventDoc.uint256Data[OrderEventUint256Value.outcome]).toNumber();
      const orderType = orderEventDoc.orderType;
      const orderId = orderEventDoc.orderId;
      const sharesEscrowed = convertOnChainAmountToDisplayAmount(new BigNumber(orderEventDoc.uint256Data[OrderEventUint256Value.sharesEscrowed], 16), tickSize).toString(10);
      const tokensEscrowed = new BigNumber(orderEventDoc.uint256Data[OrderEventUint256Value.tokensEscrowed], 16).dividedBy(10 ** 18).toString(10);
      let orderState = "OPEN";
      if (amount === "0") {
        orderState = orderEventDoc.eventType == 1 ? "CANCELED" : "FILLED";
      }
      if (!orders[market]) orders[market] = {};
      if (!orders[market][outcome]) orders[market][outcome] = {};
      if (!orders[market][outcome][orderType]) orders[market][outcome][orderType] = {};
      orders[market][outcome][orderType][orderId] = Object.assign(_.pick(orderEventDoc, [
        "transactionHash",
        "logIndex",
        "orderId",
      ]), {
          owner: orderEventDoc.addressData[OrderEventAddressValue.orderCreator],
          orderState,
          price,
          amount,
          fullPrecisionPrice: price,
          fullPrecisionAmount: amount,
          tokensEscrowed,
          sharesEscrowed,
          canceledBlockNumber: orderEventDoc.eventType == 1 ? orderEventDoc.blockNumber : undefined,
          canceledTransactionHash: orderEventDoc.eventType == 1 ? orderEventDoc.transactionHash : undefined,
          canceledTime: orderEventDoc.eventType == 1 ? orderEventDoc.timestamp : undefined,
          creationTime: originalOrderDoc ? originalOrderDoc.timestamp : 0,
          creationBlockNumber: originalOrderDoc ? originalOrderDoc.blockNumber : 0,
          originalFullPrecisionAmount: originalOrderDoc ? convertOnChainAmountToDisplayAmount(new BigNumber(originalOrderDoc.uint256Data[OrderEventUint256Value.amount], 16), tickSize).toString(10) : 0,
        } as Order);
       return orders;
    }, {} as Orders);
  }
}

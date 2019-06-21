import { SortLimit } from './types';
import { DB } from "../db/DB";
import * as _ from "lodash";
import { Augur, numTicksToTickSize, convertOnChainAmountToDisplayAmount, convertOnChainPriceToDisplayPrice, convertDisplayPriceToOnChainPrice } from "../../index";
import { BigNumber } from "bignumber.js";
import { Getter } from "./Router";
import { Address, ParsedOrderEventLog, OrderEventType } from "../logs/types";

import * as t from "io-ts";

const ZERO = new BigNumber(0);

const TradingHistoryParams = t.partial({
  universe: t.string,
  account: t.string,
  marketId: t.string,
  outcome: t.number,
  ignoreResolvedMarkets: t.boolean,
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

export const AllOrdersParams = t.partial({
  account: t.string,
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

export interface AllOrders {
  [orderId: string]: {
    orderId: Address;
    tokensEscrowed: string;
    sharesEscrowed: string;
    marketId: Address;
  }
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

export class Trading {
  public static GetTradingHistoryParams = t.intersection([SortLimit, TradingHistoryParams]);
  public static GetAllOrdersParams = AllOrdersParams;
  public static GetOrdersParams = t.intersection([SortLimit, OrdersParams]);
  public static GetBetterWorseOrdersParams = BetterWorseOrdersParams;

  @Getter("GetTradingHistoryParams")
  public static async getTradingHistory(augur: Augur, db: DB, params: t.TypeOf<typeof Trading.GetTradingHistoryParams>): Promise<Array<any>> {
    if (!params.account && !params.marketId) {
      throw new Error("'getTradingHistory' requires an 'account' or 'marketId' param be provided");
    }

    const request = {
      selector: {
        universe: params.universe,
        market: params.marketId,
        outcome: params.outcome,
        $or: [
          { orderCreator: params.account },
          { orderFiller: params.account },
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
    const marketCreatedResponse = await db.findMarketCreatedLogs({ selector: { market: { $in: marketIds } } });
    const markets = _.keyBy(marketCreatedResponse, "market");
    if (params.ignoreResolvedMarkets) {
      const marketFinalizedResponse = await db.findMarketFinalizedLogs({ selector: { market: { $in: marketIds } } });
      for (let finalizedMarket of marketFinalizedResponse) {
        if (markets[finalizedMarket.market]) {
          delete markets[finalizedMarket.market];
        }
      }
    }

    return orderFilledResponse.reduce((trades: Array<MarketTradingHistory>, orderFilledDoc) => {
      const orderDoc = orders[orderFilledDoc.orderId];
      if (!orderDoc) return trades;
      const marketDoc = markets[orderFilledDoc.market];
      if (!marketDoc) return trades;
      const isMaker: boolean | null = params.account === null ? false : params.account === orderFilledDoc.orderCreator;
      const orderType = orderDoc.orderType === 0 ? "buy" : "sell";
      const fees = new BigNumber(orderFilledDoc.fees);
      const minPrice = new BigNumber(marketDoc.prices[0]);
      const maxPrice = new BigNumber(marketDoc.prices[1]);
      const numTicks = new BigNumber(marketDoc.numTicks);
      const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
      const amount = convertOnChainAmountToDisplayAmount(new BigNumber(orderFilledDoc.amountFilled, 16), tickSize);
      const price = convertOnChainPriceToDisplayPrice(new BigNumber(orderFilledDoc.price, 16), minPrice, tickSize);
      trades.push(Object.assign(_.pick(orderFilledDoc, [
        "transactionHash",
        "logIndex",
        "orderId",
        "tradeGroupId",
      ]), {
          marketId: orderFilledDoc.market,
          outcome: new BigNumber(orderFilledDoc.outcome).toNumber(),
          maker: isMaker,
          type: isMaker ? orderType : (orderType === "buy" ? "sell" : "buy"),
          selfFilled: orderFilledDoc.orderCreator === orderFilledDoc.orderFiller,
          price: price.toString(10),
          amount: amount.toString(10),
          settlementFees: fees.toString(10),
        }) as MarketTradingHistory);
      return trades;
    }, [] as Array<MarketTradingHistory>);
  }

  @Getter("GetAllOrdersParams")
  public static async getAllOrders(augur: Augur, db: DB, params: t.TypeOf<typeof Trading.GetAllOrdersParams>): Promise<AllOrders> {
    if (!params.account) {
      throw new Error("'getAllOrders' requires an 'account' param be provided");
    }

    const request = {
      selector: {
        orderCreator: params.account,
        amount: { $gt: "0x00" }
      }
    };

    const currentOrdersResponse = await db.findCurrentOrderLogs(request);

    const marketIds = _.map(currentOrdersResponse, "market");
    const marketsResponse = await db.findMarketCreatedLogs({ selector: { market: { $in: marketIds } } });
    const markets = _.keyBy(marketsResponse, "market");

    return currentOrdersResponse.reduce((orders: AllOrders, orderEventDoc: ParsedOrderEventLog) => {
      const marketDoc = markets[orderEventDoc.market];
      if (!marketDoc) return orders;
      const minPrice = new BigNumber(marketDoc.prices[0]);
      const maxPrice = new BigNumber(marketDoc.prices[1]);
      const numTicks = new BigNumber(marketDoc.numTicks);
      const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
      const marketId = orderEventDoc.market;
      const orderId = orderEventDoc.orderId;
      const sharesEscrowed = convertOnChainAmountToDisplayAmount(new BigNumber(orderEventDoc.sharesEscrowed, 16), tickSize).toString(10);
      const tokensEscrowed = new BigNumber(orderEventDoc.tokensEscrowed, 16).dividedBy(10 ** 18).toString(10);
      orders[orderId] = {
        orderId,
        tokensEscrowed,
        sharesEscrowed,
        marketId
      };
      return orders;
    }, {} as AllOrders);
  }

  @Getter("GetOrdersParams")
  public static async getOrders(augur: Augur, db: DB, params: t.TypeOf<typeof Trading.GetOrdersParams>): Promise<Orders> {
    if (!params.universe && !params.marketId) {
      throw new Error("'getOrders' requires a 'universe' or 'marketId' param be provided");
    }
    const request = {
      selector: {
        universe: params.universe,
        market: params.marketId,
        outcome: params.outcome,
        orderType: params.orderType,
        orderCreator: params.creator,
      },
      sort: params.sortBy ? [params.sortBy] : undefined,
      limit: params.limit,
      skip: params.offset,
    };

    if (params.orderState === OrderState.OPEN) request.selector = Object.assign(request.selector, { amount: { $gt: "0x00" } });
    if (params.orderState === OrderState.CANCELED) request.selector = Object.assign(request.selector, { "eventType": 1 });
    if (params.orderState === OrderState.FILLED) request.selector = Object.assign(request.selector, { "eventType": 3 });

    if (params.latestCreationTime && params.earliestCreationTime) {
      request.selector = Object.assign(request.selector, {
        $and: [
          { timestamp: { $lte: `0x${params.latestCreationTime.toString(16)}` } },
          { timestamp: { $gte: `0x${params.earliestCreationTime.toString(16)}` } }
        ]
      });
    } else if (params.latestCreationTime) {
      request.selector = Object.assign(request.selector, { timestamp: { $lte: `0x${params.latestCreationTime.toString(16)}` } });
    } else if (params.earliestCreationTime) {
      request.selector = Object.assign(request.selector, { timestamp: { $gte: `0x${params.earliestCreationTime.toString(16)}` } });
    }

    const currentOrdersResponse = await db.findCurrentOrderLogs(request);

    const orderIds = _.map(currentOrdersResponse, "orderId");
    const originalOrdersResponse = await db.findOrderCreatedLogs({ selector: { orderId: { $in: orderIds } } });
    const originalOrders = _.keyBy(originalOrdersResponse, "orderId");

    const marketIds = _.map(currentOrdersResponse, "market");
    const marketsResponse = await db.findMarketCreatedLogs({ selector: { market: { $in: marketIds } } });
    const markets = _.keyBy(marketsResponse, "market");

    return currentOrdersResponse.reduce((orders: Orders, orderEventDoc: ParsedOrderEventLog) => {
      const marketDoc = markets[orderEventDoc.market];
      if (!marketDoc) return orders;
      const originalOrderDoc = originalOrders[orderEventDoc.orderId];
      const minPrice = new BigNumber(marketDoc.prices[0]);
      const maxPrice = new BigNumber(marketDoc.prices[1]);
      const numTicks = new BigNumber(marketDoc.numTicks);
      const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
      const amount = convertOnChainAmountToDisplayAmount(new BigNumber(orderEventDoc.amount, 16), tickSize).toString(10);
      const amountFilled = convertOnChainAmountToDisplayAmount(new BigNumber(orderEventDoc.amountFilled, 16), tickSize).toString(10);
      const price = convertOnChainPriceToDisplayPrice(new BigNumber(orderEventDoc.price, 16), minPrice, tickSize).toString(10);
      const market = orderEventDoc.market;
      const outcome = new BigNumber(orderEventDoc.outcome).toNumber();
      const orderType = orderEventDoc.orderType;
      const orderId = orderEventDoc.orderId;
      const sharesEscrowed = convertOnChainAmountToDisplayAmount(new BigNumber(orderEventDoc.sharesEscrowed, 16), tickSize).toString(10);
      const tokensEscrowed = new BigNumber(orderEventDoc.tokensEscrowed, 16).dividedBy(10 ** 18).toString(10);
      let orderState = OrderState.OPEN;
      if (orderEventDoc.eventType === OrderEventType.Fill) {
        orderState = OrderState.FILLED
      }
      if (orderEventDoc.eventType === OrderEventType.Cancel) {
        orderState = OrderState.CANCELED;
      }
      if (!orders[market]) orders[market] = {};
      if (!orders[market][outcome]) orders[market][outcome] = {};
      if (!orders[market][outcome][orderType]) orders[market][outcome][orderType] = {};
      orders[market][outcome][orderType][orderId] = Object.assign(_.pick(orderEventDoc, [
        "transactionHash",
        "logIndex",
        "orderId",
      ]), {
        owner: orderEventDoc.orderCreator,
        orderState,
        price,
        amount,
        amountFilled,
        fullPrecisionPrice: price,
        fullPrecisionAmount: amount,
        tokensEscrowed,
        sharesEscrowed,
        canceledBlockNumber: orderEventDoc.eventType === OrderEventType.Cancel ? String(orderEventDoc.blockNumber) : undefined,
        canceledTransactionHash: orderEventDoc.eventType === OrderEventType.Cancel ? orderEventDoc.transactionHash : undefined,
        canceledTime: orderEventDoc.eventType === OrderEventType.Cancel ? orderEventDoc.timestamp : undefined,
        creationTime: originalOrderDoc ? originalOrderDoc.timestamp : 0,
        creationBlockNumber: originalOrderDoc ? originalOrderDoc.blockNumber : 0,
        originalFullPrecisionAmount: originalOrderDoc ? convertOnChainAmountToDisplayAmount(new BigNumber(originalOrderDoc.amount, 16), tickSize).toString(10) : 0,
      }) as Order;
      return orders;
    }, {} as Orders);
  }

  @Getter("GetBetterWorseOrdersParams")
  public static async getBetterWorseOrders(augur: Augur, db: DB, params: t.TypeOf<typeof Trading.GetBetterWorseOrdersParams>): Promise<BetterWorseResult> {
    const request = {
      selector: {
        market: params.marketId,
        outcome: `0x0${params.outcome.toString()}`,
        orderType: params.orderType === "buy" ? 0 : 1,
        amount: { $gt: "0x00" }
      }
    };

    const currentOrdersResponse = await db.findCurrentOrderLogs(request);
    const marketReponse = await db.findMarketCreatedLogs({ selector: { market: params.marketId } });
    if (marketReponse.length < 1) throw new Error(`Market ${params.marketId} not found.`);
    const marketDoc = marketReponse[0];
    const minPrice = new BigNumber(marketDoc.prices[0]);
    const maxPrice = new BigNumber(marketDoc.prices[1]);
    const numTicks = new BigNumber(marketDoc.numTicks);
    const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
    const onChainPrice = convertDisplayPriceToOnChainPrice(new BigNumber(params.price), minPrice, tickSize);
    const [lesserOrders, greaterOrders] = _.partition(currentOrdersResponse, (order) => new BigNumber(order.price).lt(onChainPrice));
    const greaterOrder = _.reduce(greaterOrders, (result, order) => (result.orderId === null || new BigNumber(order.price).lt(result.price) ? { orderId: order.orderId, price: new BigNumber(order.price) } : result), { orderId: null, price: ZERO });
    const lesserOrder = _.reduce(lesserOrders, (result, order) => (result.orderId === null || new BigNumber(order.price).gt(result.price) ? { orderId: order.orderId, price: new BigNumber(order.price) } : result), { orderId: null, price: ZERO });
    if (params.orderType === "buy") {
      return {
        betterOrderId: greaterOrder.orderId,
        worseOrderId: lesserOrder.orderId,
      };
    } else {
      return {
        betterOrderId: lesserOrder.orderId,
        worseOrderId: greaterOrder.orderId,
      };
    }
  }
}

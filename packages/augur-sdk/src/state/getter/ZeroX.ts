import { sortOptions } from "./types";
import { DB } from "../db/DB";
import * as _ from "lodash";
import {
  Augur,
  convertOnChainAmountToDisplayAmount,
  convertOnChainPriceToDisplayPrice,
  numTicksToTickSize,
} from "../../index";
import { BigNumber } from "bignumber.js";
import { Getter } from "./Router";
import { Address, OrderEventType, ParsedOrderEventLog } from "../logs/types";

import * as t from "io-ts";

const TradingHistoryParams = t.partial({
  universe: t.string,
  account: t.string,
  marketIds: t.array(t.string),
  outcome: t.number,
  ignoreReportingStates: t.array(t.string),
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

export const makerTakerValues = {
  'either': 'either',
  'maker': 'maker',
  'taker': 'taker',
};

const makerTaker = t.keyof(makerTakerValues);

export const OrdersParams = t.partial({
  universe: t.string,
  marketId: t.string,
  outcome: OutcomeParam,
  orderType: t.string,
  account: t.string,
  orderState: t.string,
  ignoreReportingStates: t.array(t.string),
  makerTaker,
  earliestCreationTime: t.number,
  latestCreationTime: t.number,
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
  static GetTradingHistoryParams = t.intersection([
    sortOptions,
    TradingHistoryParams,
  ]);
  static GetAllOrdersParams = t.partial({
    account: t.string,
    ignoreReportingStates: t.array(t.string),
    makerTaker,
  });
  static GetOrdersParams = t.intersection([sortOptions, OrdersParams]);
  static GetBetterWorseOrdersParams = BetterWorseOrdersParams;

  @Getter('GetAllOrdersParams')
  static async getAllOrders(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Trading.GetAllOrdersParams>
  ): Promise<AllOrders> {
    if (!params.account) {
      throw new Error("'getAllOrders' requires an 'account' param be provided");
    }
    if (!params.makerTaker) {
      params.makerTaker = 'either';
    }

    const request = {
      selector: {
        amount: { $gt: '0x00' },
      },
    };
    if (params.makerTaker === 'either') {
      request.selector = Object.assign(request.selector, {
        $or: [
          { orderCreator: params.account },
          { orderFiller: params.account },
        ],
      });
    }
    if (params.makerTaker === 'maker') {
      request.selector = Object.assign(request.selector, {
        orderCreator: params.account,
      });
    }
    if (params.makerTaker === 'taker') {
      request.selector = Object.assign(request.selector, {
        orderFiller: params.account,
      });
    }

    const currentOrdersResponse = await db.findCurrentOrderLogs(request);

    const marketIds = _.map(currentOrdersResponse, 'market');
    const markets = await filterMarketsByReportingState(
      marketIds,
      db,
      params.ignoreReportingStates
    );

    return currentOrdersResponse.reduce(
      (orders: AllOrders, orderEventDoc: ParsedOrderEventLog) => {
        const marketDoc = markets[orderEventDoc.market];
        if (!marketDoc) return orders;
        const minPrice = new BigNumber(marketDoc.prices[0]);
        const maxPrice = new BigNumber(marketDoc.prices[1]);
        const numTicks = new BigNumber(marketDoc.numTicks);
        const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
        const marketId = orderEventDoc.market;
        const orderId = orderEventDoc.orderId;
        const sharesEscrowed = convertOnChainAmountToDisplayAmount(
          new BigNumber(orderEventDoc.sharesEscrowed, 16),
          tickSize
        ).toString(10);
        const tokensEscrowed = new BigNumber(orderEventDoc.tokensEscrowed, 16)
          .dividedBy(10 ** 18)
          .toString(10);
        orders[orderId] = {
          orderId,
          tokensEscrowed,
          sharesEscrowed,
          marketId,
        };
        return orders;
      },
      {} as AllOrders
    );
  }

  @Getter('GetOrdersParams')
  static async getOrders(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Trading.GetOrdersParams>
  ): Promise<Orders> {
    if (!params.universe && !params.marketId) {
      throw new Error(
        "'getOrders' requires a 'universe' or 'marketId' param be provided"
      );
    }
    if (!params.makerTaker) {
      params.makerTaker = 'either';
    }

    const request = {
      selector: {
        universe: params.universe,
        market: params.marketId,
        outcome: params.outcome,
        orderType: params.orderType,
      },
      sort: params.sortBy ? [params.sortBy] : undefined,
      limit: params.limit,
      skip: params.offset,
    };
    if (params.makerTaker === 'either') {
      request.selector = Object.assign(request.selector, {
        $or: [
          { orderCreator: params.account },
          { orderFiller: params.account },
        ],
      });
    }
    if (params.makerTaker === 'maker') {
      request.selector = Object.assign(request.selector, {
        orderCreator: params.account,
      });
    }
    if (params.makerTaker === 'taker') {
      request.selector = Object.assign(request.selector, {
        orderFiller: params.account,
      });
    }
    if (params.orderState === OrderState.OPEN) {
      request.selector = Object.assign(request.selector, {
        amount: { $gt: '0x00' },
        eventType: { $ne: 1 },
      });
    }
    if (params.orderState === OrderState.CANCELED) {
      request.selector = Object.assign(request.selector, { eventType: 1 });
    }
    if (params.orderState === OrderState.FILLED) {
      request.selector = Object.assign(request.selector, { eventType: 3 });
    }

    if (params.latestCreationTime && params.earliestCreationTime) {
      request.selector = Object.assign(request.selector, {
        $and: [
          {
            timestamp: { $lte: `0x${params.latestCreationTime.toString(16)}` },
          },
          {
            timestamp: {
              $gte: `0x${params.earliestCreationTime.toString(16)}`,
            },
          },
        ],
      });
    } else if (params.latestCreationTime) {
      request.selector = Object.assign(request.selector, {
        timestamp: { $lte: `0x${params.latestCreationTime.toString(16)}` },
      });
    } else if (params.earliestCreationTime) {
      request.selector = Object.assign(request.selector, {
        timestamp: { $gte: `0x${params.earliestCreationTime.toString(16)}` },
      });
    }

    const currentOrdersResponse = await db.findCurrentOrderLogs(request);

    const orderIds = _.map(currentOrdersResponse, 'orderId');
    const originalOrdersResponse = await db.findOrderCreatedLogs({
      selector: { orderId: { $in: orderIds } },
    });
    const originalOrders = _.keyBy(originalOrdersResponse, 'orderId');

    const marketIds = _.map(currentOrdersResponse, 'market');
    const markets = await filterMarketsByReportingState(
      marketIds,
      db,
      params.ignoreReportingStates
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

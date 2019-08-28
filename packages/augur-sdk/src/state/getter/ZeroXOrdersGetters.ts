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
import { filterMarketsByReportingState, OutcomeParam, makerTakerValues, OrdersParams, OrderState, Order, Orders, OrderType, makerTaker } from "./Trading";
import { StoredOrder } from "../db/ZeroXOrders";

import * as t from "io-ts";

export interface ZeroXOrder extends Order {
  expirationTimeSeconds: BigNumber;
  makerAssetAmount: BigNumber;
  takerAssetAmount: BigNumber;
  salt: BigNumber;
  makerAssetData: string;
  takerAssetData: string;
  signature: string;
}

export interface ZeroXOrders {
  [marketId: string]: {
    [outcome: number]: {
      [orderType: string]: {
        [orderId: string]: ZeroXOrder;
      };
    };
  };
}

export const ZeroXOrdersParams = t.partial({
  matchPrice: t.string
})

export class ZeroXOrdersGetters {
  static GetZeroXOrdersParams = t.intersection([sortOptions, OrdersParams, ZeroXOrdersParams]);

  @Getter('GetZeroXOrdersParams')
  static async getZeroXOrders(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof ZeroXOrdersGetters.GetZeroXOrdersParams>
  ): Promise<ZeroXOrders> {
    if (!params.marketId) {
      throw new Error("'getOrders' requires 'marketId' param be provided");
    }

    const request = {
      selector: {
        market: params.marketId,
        outcome: params.outcome,
        orderType: params.orderType
      },
      sort: params.sortBy ? [params.sortBy] : undefined,
      limit: params.limit,
      skip: params.offset,
    };

    console.log(`GETTING ZEROX ORDERS LOGS`);
    let currentOrdersResponse = await db.findZeroXOrderLogs(request);

    if (params.matchPrice) {
      if (!params.orderType) throw new Error("Cannot specify match price without order type");
      currentOrdersResponse = _.filter((currentOrdersResponse), (storedOrder) => {
        return params.orderType == "buy" ? storedOrder.price < params.matchPrice : storedOrder.price > params.matchPrice;
      });
    }

    const marketIds = _.map(currentOrdersResponse, 'market');
    const markets = await filterMarketsByReportingState(
      marketIds,
      db,
      params.ignoreReportingStates
    );

    return currentOrdersResponse.reduce(
      (orders: ZeroXOrders, order: StoredOrder) => {
        const marketDoc = markets[order.market];
        if (!marketDoc) return orders;
        const minPrice = new BigNumber(marketDoc.prices[0]);
        const maxPrice = new BigNumber(marketDoc.prices[1]);
        const numTicks = new BigNumber(marketDoc.numTicks);
        const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
        const amount = convertOnChainAmountToDisplayAmount(
          new BigNumber(order.amount),
          tickSize
        ).toString(10);
        const amountFilled = convertOnChainAmountToDisplayAmount(
          (new BigNumber(order.signedOrder.takerAssetAmount)).minus(new BigNumber(order.amount)),
          tickSize
        ).toString(10);
        const price = convertOnChainPriceToDisplayPrice(
          new BigNumber(order.price, 16),
          minPrice,
          tickSize
        ).toString(10);
        const market = order.market;
        const outcome = new BigNumber(order.outcome).toNumber();
        const orderType = new BigNumber(order.orderType).toNumber();
        const orderId = order["_id"];
        let orderState = OrderState.OPEN;
        if (!orders[market]) orders[market] = {};
        if (!orders[market][outcome]) orders[market][outcome] = {};
        if (!orders[market][outcome][orderType]) {
          orders[market][outcome][orderType] = {};
        }
        orders[market][outcome][orderType][orderId] = {
          owner: order.signedOrder.makerAddress,
          orderState,
          price,
          amount,
          kycToken: order.kycToken,
          amountFilled,
          expirationTimeSeconds: order.signedOrder.expirationTimeSeconds,
          fullPrecisionPrice: price,
          fullPrecisionAmount: amount,
          originalFullPrecisionAmount: "0",
          makerAssetAmount: order.signedOrder.makerAssetAmount,
          takerAssetAmount: order.signedOrder.takerAssetAmount,
          salt: order.signedOrder.salt,
          makerAssetData: order.signedOrder.makerAssetData,
          takerAssetData: order.signedOrder.takerAssetData,
          signature: order.signedOrder.signature
        } as ZeroXOrder;
        return orders;
      },
      {} as ZeroXOrders
    );
  }
}

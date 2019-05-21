import { SortLimit } from './types';
import { DB } from "../db/DB";
import * as _ from "lodash";
import { Augur, numTicksToTickSize, convertOnChainAmountToDisplayAmount, convertOnChainPriceToDisplayPrice } from "../../index";
import { BigNumber } from "bignumber.js";
import { Getter } from "./Router";
import { ethers } from "ethers";
import { OrderEventAddressValue, OrderEventUint256Value, ORDER_EVENT_CREATOR, ORDER_EVENT_FILLER, ORDER_EVENT_OUTCOME } from "../logs/types";

import * as t from "io-ts";

const TradingHistoryParams = t.partial({
  universe: t.string,
  account: t.string,
  marketId: t.string,
  outcome: t.number,
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

export class Trading {
  public static GetTradingHistoryParams = t.intersection([SortLimit, TradingHistoryParams]);

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
}

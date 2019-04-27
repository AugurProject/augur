import { SortLimit } from './types';
import { DB } from "../db/DB";
import * as _ from "lodash";
import { Augur, numTicksToTickSize, convertOnChainAmountToDisplayAmount, convertOnChainPriceToDisplayPrice } from "@augurproject/api";
import { BigNumber } from "bignumber.js";
import { Getter } from "./Router";
import { ethers } from "ethers";

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
  public static async getTradingHistory<TBigNumber>(augur: Augur<ethers.utils.BigNumber>, db: DB<TBigNumber>, params: t.TypeOf<typeof Trading.GetTradingHistoryParams>): Promise<Array<any>> {
    if (!params.account && !params.marketId) {
      throw new Error("'getTradingHistory' requires an 'account' or 'marketId' param be provided");
    }
    const request = {
      selector: {
        universe: params.universe,
        market: params.marketId,
        outcome: params.outcome,
        $or: [
          { creator: params.account },
          { filler: params.account },
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
      const isMaker: boolean | null = params.account == null ? false : params.account === orderFilledDoc.creator;
      const orderType = orderDoc.orderType === 0 ? "buy" : "sell";
      const fees = new BigNumber(orderFilledDoc.fees);
      const minPrice = new BigNumber(marketDoc.prices[0]._hex);
      const maxPrice = new BigNumber(marketDoc.prices[1]._hex);
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
          selfFilled: orderFilledDoc.creator === orderFilledDoc.filler,
          price: price.toString(10),
          amount: amount.toString(10),
          settlementFees: fees.toString(10),
        }) as MarketTradingHistory);
      return trades;
    }, [] as Array<MarketTradingHistory>);
  }
}

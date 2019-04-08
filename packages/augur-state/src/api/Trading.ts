import {SortLimit} from './types';
import { DB } from "../db/DB";
import * as _ from "lodash";
import { numTicksToTickSize, convertOnChainAmountToDisplayAmount, convertOnChainPriceToDisplayPrice } from "@augurproject/api";
import { BigNumber } from "bignumber.js";
import { TrackedUsers } from '../db/TrackedUsers';

export interface TradingHistoryParams {
  universe?: string,
  account?: string,
  marketId?: string,
  outcome?: number,
  earliestCreationTime?: number,
  latestCreationTime?: number,
};

export interface GetTradingHistoryParams extends TradingHistoryParams, SortLimit {
}

export interface MarketTradingHistory {
  transactionHash: string;
  logIndex: number;
  orderId: string;
  type: string;
  price: string;
  amount: string;
  maker: boolean|null;
  selfFilled: boolean;
  marketCreatorFees: string;
  reporterFees: string;
  settlementFees: string;
  marketId: string;
  outcome: number;
  timestamp: number;
  tradeGroupId: string|null;
}

export class Trading<TBigNumber> {
  private readonly db: DB<TBigNumber>;

  constructor(db: DB<TBigNumber>) {
    this.db = db;
  }

  public async getTradingHistory(params: GetTradingHistoryParams): Promise<Array<any>> {
    if (!params.account && !params.marketId) {
      throw new Error("'getTradingHistory' requires an 'account' or 'marketId' param be provided");
    }
    const request = {
      selector: { 
        universe: params.universe,
        marketId: params.marketId,
        outcome: params.outcome,
        $or: [
          {creator: params.account},
          {filler : params.account}
        ]
      },
      sort: params.sortBy ? [params.sortBy] : undefined,
      limit: params.limit,
      skip: params.offset,
    };
    const orderFilledResponse = await this.db.findOrderFilledLogs(request);

    const orderIds = _.map(orderFilledResponse, "orderId");

    const ordersResponse = await this.db.findOrderCreatedLogs({selector: {orderId: {$in: orderIds}}});
    const orders = _.keyBy(ordersResponse, "orderId");

    const marketIds = _.map(orderFilledResponse, "marketId");

    const marketsResponse = await this.db.findMarketCreatedLogs({selector: {market: {$in: marketIds}}});
    const markets = _.keyBy(marketsResponse, "market");

    return orderFilledResponse.reduce((trades: Array<MarketTradingHistory>, orderFilledDoc) => {
      const orderDoc = orders[orderFilledDoc.orderId];
      if (!orderDoc) return trades;
      const marketDoc = markets[orderDoc.marketId];
      if (!marketDoc) return trades;
      const isMaker: boolean | null = params.account == null ? false : params.account === orderFilledDoc.creator;
      const orderType = orderDoc.orderType === 0 ? "buy" : "sell";
      const marketCreatorFees = new BigNumber(orderFilledDoc.marketCreatorFees);
      const reporterFees = new BigNumber(orderFilledDoc.reporterFees);
      const minPrice = new BigNumber(marketDoc.minPrice);
      const maxPrice = new BigNumber(marketDoc.maxPrice);
      const numTicks = new BigNumber(marketDoc.numTicks);
      const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
      const amount = convertOnChainAmountToDisplayAmount(new BigNumber(orderFilledDoc.amountFilled, 16), tickSize);
      const price = convertOnChainPriceToDisplayPrice(new BigNumber(orderDoc.price, 16), minPrice, tickSize);
      trades.push(Object.assign(_.pick(orderFilledDoc, [
        "transactionHash",
        "logIndex",
        "orderId",
        "marketId",
        "timestamp",
        "tradeGroupId",
      ]), {
        outcome: new BigNumber(orderFilledDoc.outcome).toNumber(),
        maker: isMaker,
        type: isMaker ? orderType : (orderType === "buy" ? "sell" : "buy"),
        selfFilled: orderFilledDoc.creator === orderFilledDoc.filler,
        price: price.toString(10),
        amount: amount.toString(10),
        marketCreatorFees: marketCreatorFees.toString(10),
        reporterFees: reporterFees.toString(10),
        settlementFees: reporterFees.plus(marketCreatorFees).toString(10),
      }) as MarketTradingHistory);
      return trades;
    }, [] as Array<MarketTradingHistory>);
  }
}

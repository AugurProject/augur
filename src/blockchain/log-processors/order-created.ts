import Augur from "augur.js";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { FormattedLog, OrdersRow, ErrorCallback } from "../../types";
import { convertFixedPointToDecimal } from "../../utils/convert-fixed-point-to-decimal";
import { denormalizePrice } from "../../utils/denormalize-price";
import { formatOrderAmount, formatOrderPrice } from "../../utils/format-order";
import { WEI_PER_ETHER } from "../../constants";

export function processOrderCreatedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  // TODO check for race condition: make sure block timestamp is written BEFORE log processor is triggered
  trx.select("blockTimestamp").from("blocks").where({ blockNumber: log.blockNumber }).asCallback((err?: Error|null, blocksRow?: {blockTimestamp: number}): void => {
    if (err) return callback(err);
    if (!blocksRow) return callback(new Error("block timestamp not found"));
    trx.select(["marketID", "outcome"]).from("tokens").where({ contractAddress: log.shareToken }).asCallback((err?: Error|null, tokensRow?: {marketID: string, outcome: number}): void => {
      if (err) return callback(err);
      if (!tokensRow) return callback(new Error("market and outcome not found"));
      trx.select(["minPrice", "maxPrice", "numTicks"]).from("markets").where({ marketID: tokensRow.marketID }).asCallback((err?: Error|null, marketsRow?: {minPrice: number, maxPrice: number, numTicks: number}): void => {
        if (err) return callback(err);
        if (!marketsRow) return callback(new Error("market min price, max price, and/or num ticks not found"));
        const fullPrecisionPrice: string = denormalizePrice(marketsRow.minPrice, marketsRow.maxPrice, convertFixedPointToDecimal(log.price, marketsRow.numTicks));
        const fullPrecisionAmount: string = convertFixedPointToDecimal(log.amount, marketsRow.numTicks);
        const dataToInsert: OrdersRow = {
          orderID: log.orderID,
          marketID: tokensRow.marketID,
          outcome: tokensRow.outcome,
          shareToken: log.shareToken,
          orderType: log.orderType,
          orderCreator: log.creator,
          creationTime: blocksRow.blockTimestamp,
          creationBlockNumber: log.blockNumber,
          price: formatOrderPrice(log.orderType, marketsRow.minPrice, marketsRow.maxPrice, fullPrecisionPrice),
          amount: formatOrderAmount(marketsRow.minPrice, marketsRow.maxPrice, fullPrecisionAmount),
          fullPrecisionPrice,
          fullPrecisionAmount,
          tokensEscrowed: convertFixedPointToDecimal(log.tokensEscrowed, WEI_PER_ETHER),
          sharesEscrowed: convertFixedPointToDecimal(log.sharesEscrowed, marketsRow.numTicks),
          betterOrderID: log.betterOrderID,
          worseOrderID: log.worseOrderID,
          tradeGroupID: log.tradeGroupID,
        };
        db.transacting(trx).insert(dataToInsert).into("orders").asCallback(callback);
      });
    });
  });
}

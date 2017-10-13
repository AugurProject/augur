import Augur = require("augur.js");
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { FormattedLog, OrdersRow, ErrorCallback } from "../../types";
import { convertFixedPointToDecimal } from "../../utils/convert-fixed-point-to-decimal";
import { denormalizePrice } from "../../utils/denormalize-price";
import { formatOrderAmount, formatOrderPrice } from "../../utils/format-order";

export function processOrderCreatedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  trx.raw(`SELECT "blockTimestamp" FROM blocks WHERE "blockNumber" = ?`, [log.blockNumber]).asCallback((err?: Error|null, blocksRow?: {blockTimestamp: number}): void => {
    if (err) return callback(err);
    if (!blocksRow) return callback(new Error("block timestamp not found"));
    trx.raw(`SELECT "marketID", "outcome" FROM token WHERE "contractAddress" = ?`, [log.shareToken]).asCallback((err?: Error|null, tokensRow?: {marketID: string, outcome: number}): void => {
      if (err) return callback(err);
      if (!tokensRow) return callback(new Error("market and outcome not found"));
      trx.raw(`SELECT "minPrice", "maxPrice", "numTicks" FROM markets WHERE "marketID" = ?`, [tokensRow.marketID]).asCallback((err?: Error|null, marketsRow?: {minPrice: number, maxPrice: number, numTicks: number}): void => {
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
          tokensEscrowed: convertFixedPointToDecimal(log.tokensEscrowed, marketsRow.numTicks),
          sharesEscrowed: convertFixedPointToDecimal(log.sharesEscrowed, marketsRow.numTicks),
          betterOrderID: log.betterOrderID,
          worseOrderID: log.worseOrderID,
          tradeGroupID: log.tradeGroupID
        };
        db.transacting(trx).insert(dataToInsert).into("orders").asCallback(callback);
      });
    });
  });
}

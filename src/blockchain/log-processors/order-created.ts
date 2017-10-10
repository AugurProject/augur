import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { FormattedLog, OrdersRow, ErrorCallback } from "../../types";
import { convertFixedPointToDecimal } from "../../utils/convert-fixed-point-to-decimal";
import { denormalizePrice } from "../../utils/denormalize-price";
import { formatOrderAmount, formatOrderPrice } from "../../utils/format-order";

export function processOrderCreatedLog(db: Knex, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  trx.raw("SELECT block_timestamp FROM blocks WHERE block_number = ?", [log.blockNumber]).asCallback((err?: Error|null, blocksRow?: {block_timestamp: number}): void => {
    if (err) return callback(err);
    if (!blocksRow) return callback(new Error("block timestamp not found"));
    trx.raw("SELECT market_id, outcome FROM token WHERE contract_address = ?", [log.shareToken]).asCallback((err?: Error|null, tokensRow?: {market_id: string, outcome: number}): void => {
      if (err) return callback(err);
      if (!tokensRow) return callback(new Error("market and outcome not found"));
      trx.raw("SELECT min_price, max_price, num_ticks FROM markets WHERE market_id = ?", [tokensRow.market_id]).asCallback((err?: Error|null, marketsRow?: {min_price: number, max_price: number, num_ticks: number}): void => {
        if (err) return callback(err);
        if (!marketsRow) return callback(new Error("market min price, max price, and/or num ticks not found"));
        const fullPrecisionPrice: string = denormalizePrice(marketsRow.min_price, marketsRow.max_price, convertFixedPointToDecimal(log.price, marketsRow.num_ticks));
        const fullPrecisionAmount: string = convertFixedPointToDecimal(log.amount, marketsRow.num_ticks);
        const dataToInsert: OrdersRow = {
          order_id: log.orderId,
          market_id: tokensRow.market_id,
          outcome: tokensRow.outcome,
          share_token: log.shareToken,
          order_type: log.orderType,
          order_creator: log.creator,
          creation_time: blocksRow.block_timestamp,
          creation_block_number: log.blockNumber,
          price: formatOrderPrice(log.orderType, marketsRow.min_price, marketsRow.max_price, fullPrecisionPrice),
          amount: formatOrderAmount(marketsRow.min_price, marketsRow.max_price, fullPrecisionAmount),
          full_precision_price: fullPrecisionPrice,
          full_precision_amount: fullPrecisionAmount,
          tokens_escrowed: convertFixedPointToDecimal(log.tokensEscrowed, marketsRow.num_ticks),
          shares_escrowed: convertFixedPointToDecimal(log.sharesEscrowed, marketsRow.num_ticks),
          better_order_id: log.betterOrderId,
          worse_order_id: log.worseOrderId,
          trade_group_id: log.tradeGroupId
        };
        db.transacting(trx).insert(dataToInsert).into("orders").asCallback(callback);
      });
    });
  });
}

import * as Knex from "knex";
import { FormattedLog, ErrorCallback } from "../../types";

export function processOrderCreatedLog(db: Knex, log: FormattedLog, callback: ErrorCallback): void {
  db.raw("select block_timestamp from blocks where block_number = ?", [log.blockNumber])
  .asCallback((err?: Error|null, blocksRow?: {block_timestamp: number}): void => {
    if (err) return callback(err);
    if (!blocksRow) return callback(new Error("block timestamp not found"));

    db.raw("select market, outcome from token where contract_address = ?", [log.shareToken])
      .asCallback((err?: Error|null, tokensRow?: {market: string, outcome: number}): void => {
        if (err) return callback(err);
        if (!tokensRow) return callback(new Error("market and outcome not found"));
        const dataToInsert: {} = {
          order_id: log.orderId,
          market: tokensRow.market,
          outcome: tokensRow.outcome,
          share_token: log.shareToken,
          order_type: log.orderType,
          order_creator: log.creator,
          creation_time: blocksRow.block_timestamp,
          creation_block_number: log.blockNumber,
          price: log.price,
          amount: log.amount,
          tokens_escrowed: log.tokensEscrowed,
          shares_escrowed: log.sharesEscrowed,
          trade_grou_id: log.tradeGroupId
        };

      db.insert(dataToInsert).into("orders").asCallback(callback);
    });
  });
}

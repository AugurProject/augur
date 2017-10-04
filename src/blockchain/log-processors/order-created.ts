import * as Knex from "knex";
import { FormattedLog, ErrorCallback } from "../../types";

export function processOrderCreatedLog(db: Knex, log: FormattedLog, callback: ErrorCallback): void {
  db("blocks").select("block_timestamp").where({block_number: log.blockNumber}).asCallback((err?: Error|null, blocksRow?: {block_timestamp: number}): void => {
    if (err) return callback(err);
    if (!blocksRow) return callback(new Error("block timestamp not found"));
    db("token").select("market", "outcome").where({contract_address: log.shareToken}).asCallback((err?: Error|null, tokensRow?: {market: string, outcome: number}): void => {
      if (err) return callback(err);
      if (!tokensRow) return callback(new Error("market and outcome not found"));
      const dataToInsert: (string|number)[] = [
        log.orderId, tokensRow.market, tokensRow.outcome, log.shareToken, log.orderType, log.creator, blocksRow.block_timestamp, log.blockNumber, log.price, log.amount, log.tokensEscrowed, log.sharesEscrowed, log.tradeGroupId
      ];
      db.insert(dataToInsert).into("orders").asCallback(callback);
    });
  });
}

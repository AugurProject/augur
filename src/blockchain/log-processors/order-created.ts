import { Database } from "sqlite3";
import { FormattedLog, ErrorCallback } from "../../types";

export function processOrderCreatedLog(db: Database, log: FormattedLog, callback: ErrorCallback): void {
  db.get(`SELECT block_timestamp FROM blocks WHERE block_number = ?`, [log.blockNumber], (err?: Error|null, blocksRow?: {block_timestamp: number}): void => {
    if (err) return callback(err);
    if (!blocksRow) return callback(new Error("block timestamp not found"));
    db.get(`SELECT market, outcome FROM tokens WHERE contract_address = ?`, [log.shareToken], (err?: Error|null, tokensRow?: {market: string, outcome: number}): void => {
      if (err) return callback(err);
      if (!tokensRow) return callback(new Error("market and outcome not found"));
      const dataToInsert: (string|number)[] = [
        log.orderId, tokensRow.market, tokensRow.outcome, log.shareToken, log.orderType, log.creator, blocksRow.block_timestamp, log.blockNumber, log.price, log.amount, log.tokensEscrowed, log.sharesEscrowed, log.tradeGroupId
      ];
      db.run(`INSERT INTO orders
        (order_id, market, outcome, share_token, order_type, creator, creation_time, creation_block_number, price, amount, tokens_escrowed, shares_escrowed, trade_group_id)
        VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
    });
  });
}

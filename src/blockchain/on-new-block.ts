import Augur = require("augur.js");
import * as Knex from "knex";
import { logError } from "../utils/log-error";

export function onNewBlock(db: Knex, augur: Augur, blockNumber: string) {
  augur.rpc.eth.getBlockByNumber([blockNumber, false], (block: any): void => {
    if (!block || block.error || !block.timestamp) return logError(new Error(JSON.stringify(block)));
    console.log("new block:", parseInt(blockNumber, 16), parseInt(block.timestamp, 16));
    const dataToInsertOrReplace: (string|number)[] = [parseInt(blockNumber, 16), parseInt(block.timestamp, 16)];
    // PG NB: Does this work on pgsql?
    db.transaction((trx) => {
      trx.raw(`INSERT OR REPLACE INTO blocks (block_number, block_timestamp) VALUES (?, ?)`, dataToInsertOrReplace)
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .then(logError)
    .catch(logError);
  });
}

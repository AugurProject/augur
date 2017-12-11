import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../../types";
import { augurEmitter } from "../../../events";

export function processBurnLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  const tokenBurnDataToInsert = {
    transactionHash: log.transactionHash,
    logIndex:        log.logIndex,
    sender:          log.target,
    recipient:       null,
    token:           log.address,
    value:           log.value || log.amount,
    blockNumber:     log.blockNumber,
  };
  augurEmitter.emit("TokenBurn", tokenBurnDataToInsert);
  db.transacting(trx).insert(tokenBurnDataToInsert).into("transfers").asCallback(callback);
}

export function processBurnLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit("TokenBurn", log);
  db.transacting(trx).from("transfers").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback(callback);
}

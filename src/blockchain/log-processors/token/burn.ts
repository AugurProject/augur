import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../../types";
import { augurEmitter } from "../../../events";
import { increaseTokenBalance } from "./increase-token-balance";
import { decreaseTokenBalance } from "./decrease-token-balance";

export function processBurnLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  const tokenBurnDataToInsert = {
    transactionHash: log.transactionHash,
    logIndex:        log.logIndex,
    sender:          log.target,
    recipient:       null,
    token:           log.token || log.address,
    value:           log.amount || log.value,
    blockNumber:     log.blockNumber,
  };
  augurEmitter.emit("TokenBurn", tokenBurnDataToInsert);
  db.transacting(trx).insert(tokenBurnDataToInsert).into("transfers").asCallback((err: Error|null): void => {
    if (err) return callback(err);
    decreaseTokenBalance(db, augur, trx, log.token || log.address, log.target, Number(log.amount || log.value), callback);
  });
}

export function processBurnLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit("TokenBurn", log);
  db.transacting(trx).from("transfers").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    increaseTokenBalance(db, augur, trx, log.token || log.address, log.target, Number(log.amount || log.value), callback);
  });
}

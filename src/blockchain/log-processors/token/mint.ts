import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../../types";
import { increaseTokenBalance } from "./increase-token-balance";
import { decreaseTokenBalance } from "./decrease-token-balance";

export function processMintLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db.transacting(trx).insert({
    transactionHash: log.transactionHash,
    logIndex:        log.logIndex,
    sender:          null,
    recipient:       log.target,
    token:           log.token,
    value:           log.amount,
    blockNumber:     log.blockNumber,
  }).into("transfers").asCallback((err: Error|null): void => {
    if (err) return callback(err);
    increaseTokenBalance(db, augur, trx, log.token, log.target, Number(log.amount), callback);
  });
}

export function processMintLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db.transacting(trx).from("transfers").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    decreaseTokenBalance(db, augur, trx, log.token, log.target, Number(log.amount), callback);
  });
}

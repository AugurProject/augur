import Augur from "augur.js";
import * as Knex from "knex";
import { parallel } from "async";
import { FormattedEventLog, ErrorCallback, AsyncCallback } from "../../../types";
import { increaseTokenBalance } from "./increase-token-balance";
import { increaseTokenSupply } from "./increase-token-supply";
import { decreaseTokenBalance } from "./decrease-token-balance";
import { decreaseTokenSupply } from "./decrease-token-supply";

export function processMintLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  const value = Number(log.amount || log.value);
  const token = log.token || log.address;
  db.transacting(trx).insert({
    transactionHash: log.transactionHash,
    logIndex:        log.logIndex,
    sender:          null,
    recipient:       log.target,
    token,
    value,
    blockNumber:     log.blockNumber,
  }).into("transfers").asCallback((err: Error|null): void => {
    if (err) return callback(err);
    parallel([
      (next: AsyncCallback): void => increaseTokenSupply(db, augur, trx, token, value, next),
      (next: AsyncCallback): void => increaseTokenBalance(db, augur, trx, token, log.target, value, next),
    ], callback);
  });
}

export function processMintLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  const value = Number(log.amount || log.value);
  const token = log.token || log.address;
  db.transacting(trx).from("transfers").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    parallel([
      (next: AsyncCallback): void => decreaseTokenSupply(db, augur, trx, token, value, next),
      (next: AsyncCallback): void => decreaseTokenBalance(db, augur, trx, token, log.target, value, next),
    ], callback);
  });
}

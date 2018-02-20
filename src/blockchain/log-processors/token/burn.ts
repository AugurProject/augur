import Augur from "augur.js";
import * as Knex from "knex";
import { parallel } from "async";
import { FormattedEventLog, ErrorCallback, AsyncCallback } from "../../../types";
import { augurEmitter } from "../../../events";
import { increaseTokenBalance } from "./increase-token-balance";
import { increaseTokenSupply } from "./increase-token-supply";
import { decreaseTokenBalance } from "./decrease-token-balance";
import { decreaseTokenSupply } from "./decrease-token-supply";

export function processBurnLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  const value = Number(log.amount || log.value);
  const token = log.token || log.address;
  const tokenBurnDataToInsert = {
    transactionHash: log.transactionHash,
    logIndex:        log.logIndex,
    sender:          log.target,
    recipient:       null,
    token,
    value,
    blockNumber:     log.blockNumber,
  };
  augurEmitter.emit("TokenBurn", tokenBurnDataToInsert);
  db.transacting(trx).insert(tokenBurnDataToInsert).into("transfers").asCallback((err: Error|null): void => {
    if (err) return callback(err);
    parallel([
      (next: AsyncCallback): void => decreaseTokenSupply(db, augur, trx, token, value, next),
      (next: AsyncCallback): void => decreaseTokenBalance(db, augur, trx, token, log.target, value, next),
    ], callback);
  });
}

export function processBurnLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  const value = Number(log.amount || log.value);
  const token = log.token || log.address;
  augurEmitter.emit("TokenBurn", log);
  db.transacting(trx).from("transfers").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    parallel([
      (next: AsyncCallback): void => increaseTokenSupply(db, augur, trx, token, value, next),
      (next: AsyncCallback): void => increaseTokenBalance(db, augur, trx, token, log.target, value, next),
    ], callback);
  });
}

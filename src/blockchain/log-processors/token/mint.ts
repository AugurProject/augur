import Augur from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { parallel } from "async";
import { FormattedEventLog, ErrorCallback, AsyncCallback } from "../../../types";
import { increaseTokenBalance } from "./increase-token-balance";
import { increaseTokenSupply } from "./increase-token-supply";
import { decreaseTokenBalance } from "./decrease-token-balance";
import { decreaseTokenSupply } from "./decrease-token-supply";

export function processMintLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const value = new BigNumber(log.amount || log.value);
  const token = log.token || log.address;
  db.insert({
    transactionHash: log.transactionHash,
    logIndex:        log.logIndex,
    sender:          null,
    recipient:       log.target,
    value:           value.toFixed(),
    blockNumber:     log.blockNumber,
    token,
  }).into("transfers").asCallback((err: Error|null): void => {
    if (err) return callback(err);
    parallel([
      (next: AsyncCallback): void => increaseTokenSupply(db, augur, token, value, next),
      (next: AsyncCallback): void => increaseTokenBalance(db, augur, token, log.target, value, next),
    ], callback);
  });
}

export function processMintLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const value = new BigNumber(log.amount || log.value);
  const token = log.token || log.address;
  db.from("transfers").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    parallel([
      (next: AsyncCallback): void => decreaseTokenSupply(db, augur, token, value, next),
      (next: AsyncCallback): void => decreaseTokenBalance(db, augur, token, log.target, value, next),
    ], callback);
  });
}

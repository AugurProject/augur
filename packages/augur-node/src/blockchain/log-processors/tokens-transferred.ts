import Augur from "augur.js";
import * as Knex from "knex";
import { series } from "async";
import { BigNumber } from "bignumber.js";
import { FormattedEventLog, ErrorCallback, AsyncCallback } from "../../types";
import { augurEmitter } from "../../events";
import { increaseTokenBalance } from "./token/increase-token-balance";
import { decreaseTokenBalance } from "./token/decrease-token-balance";
import { SubscriptionEventNames } from "../../constants";

export function processTokensTransferredLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const token = log.token || log.address;
  const value = new BigNumber(log.value || log.amount, 10);
  const tokenTransferDataToInsert = {
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
    sender: log.from,
    recipient: log.to,
    value: value.toString(),
    blockNumber: log.blockNumber,
    token,
  };
  db.insert(tokenTransferDataToInsert).into("transfers").asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit(SubscriptionEventNames.TokensTransferred, Object.assign({}, log, tokenTransferDataToInsert));
    series([
      (next: AsyncCallback): void => increaseTokenBalance(db, augur, token, log.to, value, next),
      (next: AsyncCallback): void => decreaseTokenBalance(db, augur, token, log.from, value, next),
    ], callback);
  });
}

export function processTokensTransferredLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("transfers").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit(SubscriptionEventNames.TokensTransferred, log);
    const token = log.token || log.address;
    const value = new BigNumber(log.value || log.amount, 10);
    series([
      (next: AsyncCallback): void => increaseTokenBalance(db, augur, token, log.from, value, next),
      (next: AsyncCallback): void => decreaseTokenBalance(db, augur, token, log.to, value, next),
    ], callback);
  });
}

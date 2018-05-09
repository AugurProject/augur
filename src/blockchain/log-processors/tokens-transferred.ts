import Augur from "augur.js";
import * as Knex from "knex";
import { series } from "async";
import { BigNumber } from "bignumber.js";
import { FormattedEventLog, ErrorCallback, AsyncCallback } from "../../types";
import { augurEmitter } from "../../events";
import { TokenType } from "../../constants";
import { updateShareTokenTransfer } from "./token/share-token-transfer";
import { increaseTokenBalance } from "./token/increase-token-balance";
import { decreaseTokenBalance } from "./token/decrease-token-balance";

export function processTokensTransferredLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const token = log.token || log.address;
  const value = new BigNumber(log.value || log.amount, 10);
  const tokenTransferDataToInsert = {
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
    sender: log.from,
    recipient: log.to,
    value: value.toFixed(),
    blockNumber: log.blockNumber,
    token,
  };
  db.insert(tokenTransferDataToInsert).into("transfers").asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("TokensTransferred", Object.assign({}, log, tokenTransferDataToInsert));
    series([
      (next: AsyncCallback): void => increaseTokenBalance(db, augur, token, log.to, value, next),
      (next: AsyncCallback): void => decreaseTokenBalance(db, augur, token, log.from, value, next),
    ], (err: Error|null): void => {
      if (err) return callback(err);
      handleShareTokenTransfer(db, augur, log, callback);
    });
  });
}

export function processTokensTransferredLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("transfers").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("TokensTransferred", log);
    const token = log.token || log.address;
    const value = new BigNumber(log.value || log.amount, 10);
    series([
      (next: AsyncCallback): void => increaseTokenBalance(db, augur, token, log.from, value, next),
      (next: AsyncCallback): void => decreaseTokenBalance(db, augur, token, log.to, value, next),
    ], (err: Error|null): void => {
      if (err) return callback(err);
      handleShareTokenTransfer(db, augur, log, callback);
    });
  });
}

function handleShareTokenTransfer(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback) {
  if (log.tokenType === TokenType.ShareToken && log.to !== log.market) {
    updateShareTokenTransfer(db, augur, log.market, log.from, log.to, callback);
  } else {
    callback(null);
  }
}

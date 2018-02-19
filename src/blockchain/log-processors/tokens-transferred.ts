import Augur from "augur.js";
import * as Knex from "knex";
import { parallel } from "async";
import { FormattedEventLog, ErrorCallback, AsyncCallback } from "../../types";
import { augurEmitter } from "../../events";
import { TokenType } from "../../constants";
import { updateShareTokenTransfer } from "./token/share-token-transfer";
import { increaseTokenBalance } from "./token/increase-token-balance";
import { decreaseTokenBalance } from "./token/decrease-token-balance";

export function processTokensTransferredLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  const tokenTransferDataToInsert = {
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
    sender: log.from,
    recipient: log.to,
    token: log.token,
    value: log.value,
    blockNumber: log.blockNumber,
  };
  db.transacting(trx).insert(tokenTransferDataToInsert).into("transfers").asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("TokensTransferred", tokenTransferDataToInsert);
    parallel([
      (next: AsyncCallback): void => increaseTokenBalance(db, augur, trx, log.token, log.to, Number(log.value), next),
      (next: AsyncCallback): void => decreaseTokenBalance(db, augur, trx, log.token, log.from, Number(log.value), next),
    ], (err: Error|null): void => {
      if (err) return callback(err);
      handleShareTokenTransfer(db, augur, trx, log, callback);
    });
  });
}

export function processTokensTransferredLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db.transacting(trx).from("transfers").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("TokensTransferred", log);
    parallel([
      (next: AsyncCallback): void => increaseTokenBalance(db, augur, trx, log.token, log.from, Number(log.value), next),
      (next: AsyncCallback): void => decreaseTokenBalance(db, augur, trx, log.token, log.to, Number(log.value), next),
    ], (err: Error|null): void => {
      if (err) return callback(err);
      handleShareTokenTransfer(db, augur, trx, log, callback);
    });
  });
}

function handleShareTokenTransfer(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback) {
  if (log.tokenType === TokenType.ShareToken && log.to !== log.market) {
    updateShareTokenTransfer(db, augur, trx, log.market, log.from, log.to, callback);
  } else {
    callback(null);
  }
}

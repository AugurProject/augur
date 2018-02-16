import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";
import { TokenType } from "../../constants";
import { updateShareTokenTransfer } from "./token/share-token-transfer";

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
    if (log.tokenType === TokenType.ShareToken && log.to !== log.market) {
      updateShareTokenTransfer(db, augur, trx, log.market, log.from, log.to, callback);
    } else {
      callback(null);
    }
  });
}

export function processTokensTransferredLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db.transacting(trx).from("transfers").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("TokensTransferred", log);
    if (log.tokenType === TokenType.ShareToken && log.to !== log.market) {
      updateShareTokenTransfer(db, augur, trx, log.market, log.from, log.to, callback);
    } else {
      callback(null);
    }
  });
}

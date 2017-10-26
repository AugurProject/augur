import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedLog, ErrorCallback } from "../../../types";

export function processTransferLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  db.transacting(trx).insert({
    transactionHash: log.transactionHash,
    logIndex:        log.logIndex,
    sender:          log.from,
    recipient:       log.to,
    token:           log.address,
    value:           log.value,
    blockNumber:     log.blockNumber,
  }).into("transfers").asCallback(callback);
}

export function processTransferLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  db.transacting(trx).from("transfers").where({ transactionHash: log.transactionHash, logIndex: log.logIndex, blockNumber: log.blockNumber, token: log.address }).del().asCallback(callback);
}

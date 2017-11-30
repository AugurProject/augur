import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../../types";

export function processMintLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db.transacting(trx).insert({
    transactionHash: log.transactionHash,
    logIndex:        log.logIndex,
    sender:          null,
    recipient:       log.target,
    token:           log.address,
    value:           log.value || log.amount,
    blockNumber:     log.blockNumber,
  }).into("transfers").asCallback(callback);
}

export function processMintLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db.transacting(trx).from("transfers").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback(callback);
}

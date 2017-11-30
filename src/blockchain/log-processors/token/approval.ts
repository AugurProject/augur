import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../../types";

export function processApprovalLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db.transacting(trx).insert({
    transactionHash: log.transactionHash,
    logIndex:        log.logIndex,
    owner:           log.owner,
    spender:         log.spender,
    token:           log.address,
    value:           log.value || log.amount,
    blockNumber:     log.blockNumber,
  }).into("approvals").asCallback(callback);
}

export function processApprovalLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db.transacting(trx).from("approvals").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback(callback);
}

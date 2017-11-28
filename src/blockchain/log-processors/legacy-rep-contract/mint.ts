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
    value:           log.value,
    blockNumber:     log.blockNumber,
  }).into("transfers").asCallback(callback);
}

import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../../types";

export function processTransferLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  // TODO divide value by numTicks for share tokens transfer logs
  db.insert({
    transactionHash: log.transactionHash,
    logIndex:        log.logIndex,
    sender:          log.from,
    recipient:       log.to,
    token:           log.address,
    value:           log.value,
    blockNumber:     log.blockNumber,
  }).into("transfers").asCallback(callback);
}

export function processTransferLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("transfers").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback(callback);
}

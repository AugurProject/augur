import * as Knex from "knex";
import { FormattedLog, ErrorCallback } from "../../../types";

export function processTransferLog(db: Knex, log: FormattedLog, callback: ErrorCallback): void {
  const dataToInsert: {} = {
    transaction_hash:  log.transactionHash,
    log_index:         log.logIndex,
    sender:            log.from,
    recipient:         log.to,
    token:             log.address,
    value:             log.value,
    block_number:      log.blockNumber
  };

  db.insert(dataToInsert).into("transfers").asCallback(callback);
}

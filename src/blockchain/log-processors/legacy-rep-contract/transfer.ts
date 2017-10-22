import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedLog, ErrorCallback } from "../../../types";

export function processTransferLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  const dataToInsert: {} = {
    transactionHash:  log.transactionHash,
    logIndex:         log.logIndex,
    sender:            log.from,
    recipient:         log.to,
    token:             log.address,
    value:             log.value,
    blockNumber:      log.blockNumber,
  };

  db.transacting(trx).insert(dataToInsert).into("transfers").asCallback(callback);
}

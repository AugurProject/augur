import Augur = require("augur.js");
import * as Knex from "knex";
import { FormattedLog, ErrorCallback } from "../../../types";

export function processApprovalLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  const dataToInsert: {} = {
    transaction_hash: log.transactionHash,
    log_index:        log.logIndex,
    owner:            log.owner,
    spender:          log.spender,
    token:            log.address,
    value:            log.value,
    block_number:     log.blockNumber
  };

  db.transacting(trx).insert(dataToInsert).into("approvals").asCallback(callback);
}

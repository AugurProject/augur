import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedLog, ErrorCallback } from "../../../types";

export function processApprovalLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  const dataToInsert: {} = {
    transactionHash: log.transactionHash,
    logIndex:        log.logIndex,
    owner:            log.owner,
    spender:          log.spender,
    token:            log.address,
    value:            log.value,
    blockNumber:     log.blockNumber,
  };

  db.transacting(trx).insert(dataToInsert).into("approvals").asCallback(callback);
}

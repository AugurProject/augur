import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedLog, ErrorCallback } from "../../types";

export function processTokensTransferredLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  const dataToInsert: {}  = {
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
    sender: log.from,
    recipient: log.to,
    token: log.token,
    value: log.value,
    blockNumber: log.blockNumber,
  };

  db.transacting(trx).insert(dataToInsert).into("transfers").asCallback(callback);
}

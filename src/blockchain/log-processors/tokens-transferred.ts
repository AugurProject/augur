import { Database } from "sqlite3";
import { FormattedLog, ErrorCallback } from "../../types";

export function processTokensTransferredLog(db: Database, log: FormattedLog, callback: ErrorCallback): void {
  const dataToInsert: (string|number)[] = [
    log.transactionHash, log.logIndex, log.from, log.to, log.token, log.value, log.blockNumber
  ];
  db.run(`INSERT INTO transfers
    (transaction_hash, log_index, sender, recipient, token, value, block_number)
    VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
}

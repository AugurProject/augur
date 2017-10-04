import { Database } from "sqlite3";
import { FormattedLog, ErrorCallback } from "../../../types";

export function processApprovalLog(db: Database, log: FormattedLog, callback: ErrorCallback): void {
  const dataToInsert: (string|number)[] = [
    log.transactionHash, log.logIndex, log.owner, log.spender, log.address, log.value, log.blockNumber
  ];
  db.run(`INSERT INTO approvals
    (transaction_hash, log_index, owner, spender, token, value, block_number)
    VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
}

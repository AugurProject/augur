import { Database } from "sqlite3";
import { Address, TransferRow, TransferLog, TransferHistory } from "./types";

export function getAccountTransferHistory(db: Database, account: Address, token: Address|null, callback: (err?: Error|null, result?: TransferHistory) => void) {
  let query: string;
  let dataToSelect: Address[];
  if (token == null) {
    query = `SELECT * FROM transfers WHERE sender = ? OR recipient = ?`;
    dataToSelect = [account, account];
  } else {
    query = `SELECT * FROM transfers WHERE (sender = ? OR recipient = ?) AND token = ?`;
    dataToSelect = [account, account, token];
  }
  db.all(query, dataToSelect, (err?: Error|null, transferRows?: TransferRow[]) => {
    if (err) return callback(err);
    if (!transferRows) return callback(null);
    const transferHistory: TransferHistory = transferRows.map((transferRow: TransferRow): TransferLog => ({
      transactionHash: transferRow.transaction_hash,
      logIndex: transferRow.log_index,
      sender: transferRow.sender,
      recipient: transferRow.recipient,
      token: transferRow.token,
      value: transferRow.value,
      blockNumber: transferRow.block_number
    }));
    callback(null, transferHistory);
  });
}

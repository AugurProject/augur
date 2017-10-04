import { Database } from "sqlite3";
import { Address, Bytes32 } from "../../types";

interface TransferRow {
  transaction_hash: Bytes32,
  log_index: number,
  sender: Address,
  recipient: Address,
  token: Address,
  value: number,
  block_number: number
}

interface TransferLog {
  transactionHash: Bytes32,
  logIndex: number,
  sender: Address,
  recipient: Address,
  token: Address,
  value: number,
  blockNumber: number
}

type TransferHistory = TransferLog[];

export function getAccountTransferHistory(db: Database, account: Address, token: Address|null, callback: (err?: Error|null, result?: TransferHistory) => void): void {
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

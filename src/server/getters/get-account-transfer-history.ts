import * as Knex from "knex";
import { Address, Bytes32 } from "../../types";

interface TransferRow {
  transaction_hash: Bytes32;
  log_index: number;
  sender: Address;
  recipient: Address;
  token: Address;
  value: number;
  block_number: number;
}

interface TransferLog {
  transactionHash: Bytes32;
  logIndex: number;
  sender: Address;
  recipient: Address;
  token: Address;
  value: number;
  blockNumber: number;
}

type TransferHistory = TransferLog[];

export function getAccountTransferHistory(db: Knex, account: Address, token: Address|null, callback: (err?: Error|null, result?: TransferHistory) => void): void {
  let query: Knex.Raw;
  if (token === null) {
    query = db.raw("select * from transfers where sender = ? OR recipient = ?", [account, account]);
  } else {
    query = db.raw("select * from transfers where (sender = ? OR recipient = ?) AND token = ?", [account, account, token]);
  }

  query.map((transferRow: TransferRow): TransferLog => ({
    transactionHash: transferRow.transaction_hash,
    logIndex: transferRow.log_index,
    sender: transferRow.sender,
    recipient: transferRow.recipient,
    token: transferRow.token,
    value: transferRow.value,
    blockNumber: transferRow.block_number
  })).asCallback(callback);
}

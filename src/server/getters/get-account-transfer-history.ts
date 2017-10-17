import * as Knex from "knex";
import { Address, Bytes32 } from "../../types";

interface TransferRow {
  transactionHash: Bytes32;
  logIndex: number;
  sender: Address;
  recipient: Address;
  token: Address;
  value: number;
  blockNumber: number;
}

export interface TransferLog {
  transactionHash: Bytes32;
  logIndex: number;
  sender: Address;
  recipient: Address;
  token: Address;
  value: number;
  blockNumber: number;
}

export type TransferHistory = Array<TransferLog>;

export function getAccountTransferHistory(db: Knex, account: Address, token: Address|null, callback: (err?: Error|null, result?: TransferHistory) => void): void {
  let query: Knex.Raw;
  if (token === null) {
    query = db.raw("SELECT * FROM transfers WHERE sender = ? OR recipient = ?", [account, account]);
  } else {
    query = db.raw("SELECT * FROM transfers WHERE (sender = ? OR recipient = ?) AND token = ?", [account, account, token]);
  }

  query.map((transferRow: TransferRow): TransferLog => ({
    transactionHash: transferRow.transactionHash,
    logIndex: transferRow.logIndex,
    sender: transferRow.sender,
    recipient: transferRow.recipient,
    token: transferRow.token,
    value: transferRow.value,
    blockNumber: transferRow.blockNumber
  })).asCallback(callback);
}

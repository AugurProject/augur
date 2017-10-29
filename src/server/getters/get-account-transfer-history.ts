import * as Knex from "knex";
import { Address, Bytes32 } from "../../types";
import { queryModifier } from "./database";

export interface TransferRow {
  transactionHash: Bytes32;
  logIndex: number;
  sender: Address;
  recipient: Address;
  token: Address;
  value: number;
  blockNumber: number;
}

export function getAccountTransferHistory(db: Knex, account: Address, token: Address|null|undefined, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, transferHistory?: Array<TransferRow>) => void): void {
  let query = db("transfers").where((db: Knex): Knex.QueryBuilder => db.where("sender", account).orWhere("recipient", account));
  if (token != null) query = query.andWhere({ token });
  query = queryModifier(query, "blockNumber", "desc", sortBy, isSortDescending, limit, offset);
  query.asCallback(callback);
}

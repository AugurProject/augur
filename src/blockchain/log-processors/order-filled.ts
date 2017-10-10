import * as Knex from "knex";
import { Bytes32, FormattedLog, ErrorCallback } from "../../types";

interface Trade {
  type: string;
  shares: string|number;
  price: string|number;
  maker: boolean; // NB: UI expects "maker" field to be true if the current user is the creator of the order, false otherwise
  tradeGroupId: Bytes32|null;
}

export function processOrderFilledLog(db: Knex, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {

}

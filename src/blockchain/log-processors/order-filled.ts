import Augur from "augur.js";
import * as Knex from "knex";
import { Bytes32, FormattedLog, ErrorCallback } from "../../types";

interface Trade {
  type: string;
  shares: string|number;
  price: string|number;
  maker: boolean; // NB: UI expects "maker" field to be true if the current user is the creator of the order, false otherwise
  tradeGroupID: Bytes32|null;
}

export function processOrderFilledLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  console.log("TODO: OrderFilled");
  console.log(log);
  callback(null);
}

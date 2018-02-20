import { Augur } from "augur.js";
import * as Knex from "knex";
import { Address, ErrorCallback } from "../../../types";

interface SupplyResult {
  supply: number;
}

export function increaseTokenSupply(db: Knex, augur: Augur, trx: Knex.Transaction, token: Address, amount: number, callback: ErrorCallback): void {
  trx.first("supply").from("token_supply").where({ token }).asCallback((err: Error|null, oldSupply?: SupplyResult): void => {
    if (err) return callback(err);
    if (oldSupply == null) {
      db.transacting(trx).insert({ token, supply: amount }).into("token_supply").asCallback(callback);
    } else {
      const supply = oldSupply.supply + amount;
      db.transacting(trx).update({ supply }).into("token_supply").where({ token }).asCallback(callback);
    }
  });
}

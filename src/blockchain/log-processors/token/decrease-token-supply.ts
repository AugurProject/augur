import { Augur } from "augur.js";
import * as Knex from "knex";
import { Address, ErrorCallback } from "../../../types";

interface SupplyResult {
  supply: number;
}

export function decreaseTokenSupply(db: Knex, augur: Augur, token: Address, amount: number, callback: ErrorCallback): void {
  db.first("supply").from("token_supply").where({ token }).asCallback((err: Error|null, oldSupply?: SupplyResult): void => {
    if (err) return callback(err);
    if (oldSupply == null) return callback(new Error(`Could not find supply for token decrease (token: ${token})`));
    const supply = oldSupply.supply - amount;
    db.update({ supply }).into("token_supply").where({ token }).asCallback(callback);
  });
}

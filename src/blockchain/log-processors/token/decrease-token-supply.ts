import { Augur } from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Address, ErrorCallback } from "../../../types";

interface SupplyResult {
  supply: BigNumber;
}

export function decreaseTokenSupply(db: Knex, augur: Augur, token: Address, amount: BigNumber, callback: ErrorCallback): void {
  db.first("supply").from("token_supply").where({ token }).asCallback((err: Error|null, oldSupply?: SupplyResult): void => {
    if (err) return callback(err);
    if (amount.isZero()) return callback(null);
    if (oldSupply == null) return callback(new Error(`Could not find supply for token decrease (token: ${token})`));
    const supply = oldSupply.supply.minus(amount);
    db.update({ supply: supply.toFixed() }).into("token_supply").where({ token }).asCallback(callback);
  });
}

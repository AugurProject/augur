import { Augur } from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Address, ErrorCallback } from "../../../types";

interface SupplyResult {
  supply: BigNumber;
}

export function increaseTokenSupply(db: Knex, augur: Augur, token: Address, amount: BigNumber, callback: ErrorCallback): void {
  db.first("supply").from("token_supply").where({ token }).asCallback((err: Error|null, oldSupply?: SupplyResult): void => {
    if (err) return callback(err);
    if (oldSupply == null) {
      db.insert({ token, supply: amount.toFixed() }).into("token_supply").asCallback(callback);
    } else {
      const supply = oldSupply.supply.plus(amount);
      db.update({ supply: supply.toFixed() }).into("token_supply").where({ token }).asCallback(callback);
    }
  });
}

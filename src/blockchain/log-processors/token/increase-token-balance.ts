import { Augur } from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Address, ErrorCallback } from "../../../types";

interface BalanceResult {
  balance: BigNumber;
}

export function increaseTokenBalance(db: Knex, augur: Augur, token: Address, owner: Address, amount: BigNumber, callback: ErrorCallback): void {
  db.first("balance").from("balances").where({ token, owner }).asCallback((err: Error|null, oldBalance?: BalanceResult): void => {
    if (err) return callback(err);
    if (oldBalance == null) {
      db.insert({ owner, token, balance: amount.toFixed() }).into("balances").asCallback(callback);
    } else {
      const balance = oldBalance.balance.plus(amount);
      db.update({ balance: balance.toFixed() }).into("balances").where({ token, owner }).asCallback(callback);
    }
  });
}

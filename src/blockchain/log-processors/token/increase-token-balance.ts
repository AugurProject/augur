import { Augur } from "augur.js";
import * as Knex from "knex";
import { Address, ErrorCallback } from "../../../types";

interface BalanceResult {
  balance: number;
}

export function increaseTokenBalance(db: Knex, augur: Augur, trx: Knex.Transaction, token: Address, owner: Address, amount: number, callback: ErrorCallback): void {
  trx.first("balance").from("balances").where({ token, owner }).asCallback((err: Error|null, oldBalance?: BalanceResult): void => {
    if (err) return callback(err);
    if (oldBalance == null) {
      db.transacting(trx).insert({ owner, token, balance: amount }).into("balances").asCallback(callback);
    } else {
      const balance = oldBalance.balance + amount;
      db.transacting(trx).update({ balance }).into("balances").where({ token, owner }).asCallback(callback);
    }
  });
}

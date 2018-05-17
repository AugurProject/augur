import { Augur } from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Address, ErrorCallback } from "../../../types";

interface BalanceResult {
  balance: BigNumber;
}

export function decreaseTokenBalance(db: Knex, augur: Augur, token: Address, owner: Address, amount: BigNumber, callback: ErrorCallback): void {
  db.first("balance").from("balances").where({ token, owner }).asCallback((err: Error|null, oldBalance?: BalanceResult): void => {
    if (err) return callback(err);
    if (amount.isZero()) return callback(null);
    if (oldBalance == null) return callback(new Error(`Could not find balance for token decrease (token: ${token}, owner: ${owner})`));
    const balance = oldBalance.balance.minus(amount);
    db.update({ balance: balance.toFixed() }).into("balances").where({ token, owner }).asCallback(callback);
  });
}

import { Augur } from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Address} from "../../../types";
import { isLegacyReputationToken } from "./is-legacy-reputation-token";

interface BalanceResult {
  balance: BigNumber;
}

export async function increaseTokenBalance(db: Knex, augur: Augur, token: Address, owner: Address, amount: BigNumber) {
  if (isLegacyReputationToken(augur, token)) return;
  const oldBalance: BalanceResult = await db.first("balance").from("balances").where({ token, owner });
  if (oldBalance == null) {
    return db.insert({ owner, token, balance: amount.toString() }).into("balances");
  } else {
    const balance = oldBalance.balance.plus(amount);
    return db.update({ balance: balance.toString() }).into("balances").where({ token, owner });
  }
}

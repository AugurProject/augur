import { Augur } from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Address} from "../../../types";
import { isLegacyReputationToken } from "./is-legacy-reputation-token";

interface BalanceResult {
  balance: BigNumber;
}

export async function decreaseTokenBalance(db: Knex, augur: Augur, token: Address, owner: Address, amount: BigNumber) {
  if (isLegacyReputationToken(augur, token)) return;
  const oldBalance: BalanceResult = await db.first("balance").from("balances").where({ token, owner });
  if (amount.isZero()) return;
  if (oldBalance == null) throw new Error(`Could not find balance for token decrease (token: ${token}, owner: ${owner})`);
  const balance = oldBalance.balance.minus(amount);
  return db.update({ balance: balance.toString() }).into("balances").where({ token, owner });
}

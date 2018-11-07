import { Augur } from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Address, FormattedEventLog } from "../../../types";
import { isLegacyReputationToken } from "./is-legacy-reputation-token";
import { updateProfitLossChangeShareBalance } from "../profit-loss/update-profit-loss";
import { TokenType } from "../../../constants";

interface BalanceResult {
  balance: BigNumber;
}

export async function decreaseTokenBalance(db: Knex, augur: Augur, token: Address, owner: Address, amount: BigNumber, log: FormattedEventLog) {
  if (isLegacyReputationToken(augur, token)) return;
  const oldBalance: BalanceResult = await db.first("balance").from("balances").where({ token, owner });
  if (amount.isZero()) return;
  if (oldBalance == null) throw new Error(`Could not find balance for token decrease (token: ${token}, owner: ${owner})`);
  const balance = oldBalance.balance.minus(amount);
  await db.update({ balance: balance.toString() }).into("balances").where({ token, owner });

  if (log.tokenType === TokenType.ShareToken) {
    await updateProfitLossChangeShareBalance(db, augur, token, balance, owner, log.transactionHash);
  }
}

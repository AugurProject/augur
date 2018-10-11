import { Augur } from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Address, ErrorCallback, FormattedEventLog } from "../../../types";
import { isLegacyReputationToken } from "./is-legacy-reputation-token";
import { QueryBuilder } from "knex";
import { updateProfitLossChangeShareBalance } from "../profit-loss/update-profit-loss";
import { TokenType } from "../../../constants";

interface BalanceResult {
  balance: BigNumber;
}

export function increaseTokenBalance(db: Knex, augur: Augur, token: Address, owner: Address, amount: BigNumber, log: FormattedEventLog, callback: ErrorCallback): void {
  if (isLegacyReputationToken(augur, token)) return callback(null);
  db.first("balance").from("balances").where({ token, owner }).asCallback((err: Error|null, oldBalance?: BalanceResult): void => {
    if (err) return callback(err);
    let upsertTokenBalance: QueryBuilder;
    let balance = amount;
    if (oldBalance == null) {
      upsertTokenBalance = db.insert({ owner, token, balance: balance.toString() }).into("balances");
    } else {
      balance = oldBalance.balance.plus(balance);
      upsertTokenBalance = db.update({ balance: balance.toString() }).into("balances").where({ token, owner });
    }
    upsertTokenBalance.asCallback((err: Error|null): void => {
      if (err) return callback(err);
      if (log.tokenType != TokenType.ShareToken) return callback(null);
      updateProfitLossChangeShareBalance(db, augur, token, balance, owner, log.transactionHash, callback);
    });
  });
}

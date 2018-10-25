import Augur from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { FormattedEventLog } from "../../types";
import { augurEmitter } from "../../events";
import { increaseTokenBalance } from "./token/increase-token-balance";
import { decreaseTokenBalance } from "./token/decrease-token-balance";
import { SubscriptionEventNames } from "../../constants";

export async function processTokensTransferredLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const token = log.token || log.address;
    const value = new BigNumber(log.value || log.amount, 10);
    const tokenTransferDataToInsert = {
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
      sender: log.from,
      recipient: log.to,
      value: value.toString(),
      blockNumber: log.blockNumber,
      token,
    };
    await db.insert(tokenTransferDataToInsert).into("transfers");
    augurEmitter.emit(SubscriptionEventNames.TokensTransferred, Object.assign({}, log, tokenTransferDataToInsert));

    await increaseTokenBalance(db, augur, token, log.to, value);
    await decreaseTokenBalance(db, augur, token, log.from, value);
  };
}


export async function processTokensTransferredLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await db.from("transfers").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del();
    augurEmitter.emit(SubscriptionEventNames.TokensTransferred, log);
    const token = log.token || log.address;
    const value = new BigNumber(log.value || log.amount, 10);
    await increaseTokenBalance(db, augur, token, log.from, value);
    await decreaseTokenBalance(db, augur, token, log.to, value);
  };
}


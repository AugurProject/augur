import { Augur, BigNumber, FormattedEventLog } from "../../types";
import Knex from "knex";

import { augurEmitter } from "../../events";
import { increaseTokenBalance } from "./token/increase-token-balance";
import { decreaseTokenBalance } from "./token/decrease-token-balance";
import { SubscriptionEventNames } from "../../constants";
import { updateProfitLossRemoveRow } from "./profit-loss/update-profit-loss";

export async function processTokensTransferredLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const token = log.token || log.address;
    const value = new BigNumber(log.value || log.amount);
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

    await increaseTokenBalance(db, augur, token, log.to, value, log);
    await decreaseTokenBalance(db, augur, token, log.from, value, log);
  };
}

export async function processTokensTransferredLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await db.from("transfers").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del();
    augurEmitter.emit(SubscriptionEventNames.TokensTransferred, log);
    const token = log.token || log.address;
    const value = new BigNumber(log.value || log.amount);
    await increaseTokenBalance(db, augur, token, log.from, value, log);
    await decreaseTokenBalance(db, augur, token, log.to, value, log);
    await updateProfitLossRemoveRow(db, log.transactionHash);
  };
}

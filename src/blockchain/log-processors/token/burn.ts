import Augur from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { FormattedEventLog } from "../../../types";
import { augurEmitter } from "../../../events";
import { increaseTokenBalance } from "./increase-token-balance";
import { increaseTokenSupply } from "./increase-token-supply";
import { decreaseTokenBalance } from "./decrease-token-balance";
import { decreaseTokenSupply } from "./decrease-token-supply";
import { SubscriptionEventNames } from "../../../constants";
import { updateProfitLossRemoveRow } from "../profit-loss/update-profit-loss";

export async function processBurnLog(db: Knex, augur: Augur, log: FormattedEventLog) {
  const value = new BigNumber(log.amount || log.value);
  const token = log.token || log.address;
  const tokenBurnDataToInsert = {
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
    sender: log.target,
    recipient: null,
    value: value.toString(),
    blockNumber: log.blockNumber,
    token,
  };
  const eventName = log.eventName as keyof typeof SubscriptionEventNames;
  augurEmitter.emit(SubscriptionEventNames[eventName], Object.assign({}, log, tokenBurnDataToInsert));
  await db.insert(tokenBurnDataToInsert).into("transfers");
  await decreaseTokenSupply(db, augur, token, value);
  await decreaseTokenBalance(db, augur, token, log.target, value, log);
}

export async function processBurnLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog) {
  const value = new BigNumber(log.amount || log.value);
  const token = log.token || log.address;
  const eventName = log.eventName as keyof typeof SubscriptionEventNames;
  augurEmitter.emit(SubscriptionEventNames[eventName], log);
  await db.from("transfers").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del();
  await increaseTokenSupply(db, augur, token, value);
  await increaseTokenBalance(db, augur, token, log.target, value, log);
  await updateProfitLossRemoveRow(db, log.transactionHash);
}

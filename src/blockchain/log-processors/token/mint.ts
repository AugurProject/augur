import Augur from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { FormattedEventLog } from "../../../types";
import { increaseTokenBalance } from "./increase-token-balance";
import { increaseTokenSupply } from "./increase-token-supply";
import { decreaseTokenBalance } from "./decrease-token-balance";
import { decreaseTokenSupply } from "./decrease-token-supply";

export async function processMintLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const value = new BigNumber(log.amount || log.value);
    const token = log.token || log.address;
    await db.insert({
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
      sender: null,
      recipient: log.target,
      value: value.toString(),
      blockNumber: log.blockNumber,
      token,
    }).into("transfers");
    await increaseTokenSupply(db, augur, token, value);
    await increaseTokenBalance(db, augur, token, log.target, value);
  };
}


export async function processMintLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const value = new BigNumber(log.amount || log.value);
    const token = log.token || log.address;
    await db.from("transfers").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del();
    await decreaseTokenSupply(db, augur, token, value);
    await decreaseTokenBalance(db, augur, token, log.target, value);
  };
}


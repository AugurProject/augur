import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog } from "../../../types";
import { augurEmitter } from "../../../events";
import { SubscriptionEventNames } from "../../../constants";

export async function processApprovalLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const tokenApprovalDataToInsert = {
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
      owner: log.owner,
      spender: log.spender,
      token: log.address,
      value: log.value,
      blockNumber: log.blockNumber,
    };
    const eventName = log.eventName as keyof typeof SubscriptionEventNames;
    augurEmitter.emit(SubscriptionEventNames[eventName], Object.assign({}, log, tokenApprovalDataToInsert));
    return db.insert(tokenApprovalDataToInsert).into("approvals");
  };
}

export async function processApprovalLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const eventName = log.eventName as keyof typeof SubscriptionEventNames;
    augurEmitter.emit(SubscriptionEventNames[eventName], log);
    return db.from("approvals").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del();
  };
}

import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../../types";
import { augurEmitter } from "../../../events";
import { SubscriptionEventNames } from "../../../constants";

export function processApprovalLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  // TODO divide value by numTicks for share tokens transfer logs
  const tokenApprovalDataToInsert = {
    transactionHash: log.transactionHash,
    logIndex:        log.logIndex,
    owner:           log.owner,
    spender:         log.spender,
    token:           log.address,
    value:           log.value,
    blockNumber:     log.blockNumber,
  };
  const eventName = log.eventName as keyof typeof SubscriptionEventNames;
  augurEmitter.emit(SubscriptionEventNames[eventName], Object.assign({}, log, tokenApprovalDataToInsert));
  db.insert(tokenApprovalDataToInsert).into("approvals").asCallback(callback);
}

export function processApprovalLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const eventName = log.eventName as keyof typeof SubscriptionEventNames;
  augurEmitter.emit(SubscriptionEventNames[eventName], log);
  db.from("approvals").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback(callback);
}

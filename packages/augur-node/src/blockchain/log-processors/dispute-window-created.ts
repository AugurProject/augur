import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, Address, DisputeWindowState } from "../../types";
import { augurEmitter } from "../../events";
import { advanceDisputeWindowActive, getCurrentTime } from "../process-block";
import { SubscriptionEventNames } from "../../constants";

export function processDisputeWindowCreatedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const disputeWindowToInsert = {
    disputeWindow: log.disputeWindow,
    disputeWindowId: log.id,
    universe: log.universe,
    startTime: log.startTime,
    endTime: log.endTime,
    state: DisputeWindowState.FUTURE,
    fees: 0,
  };
  augurEmitter.emit(SubscriptionEventNames.DisputeWindowCreated, Object.assign({}, log, disputeWindowToInsert));
  db.from("dispute_windows").insert(disputeWindowToInsert).asCallback(callback);
}

export function processDisputeWindowCreatedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit(SubscriptionEventNames.DisputeWindowCreated, log);
  db.from("dispute_windows").where({ disputeWindow: log.disputeWindow }).del().asCallback(callback);
}

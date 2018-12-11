import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, Address, DisputeWindowState } from "../../types";
import { augurEmitter } from "../../events";
import { advanceDisputeWindowActive, getCurrentTime } from "../process-block";
import { SubscriptionEventNames } from "../../constants";

export async function processDisputeWindowCreatedLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const disputeWindowToInsert = {
      disputeWindow: log.disputeWindow,
      disputeWindowId: log.id,
      universe: log.universe,
      startTime: log.startTime,
      endTime: log.endTime,
      state: DisputeWindowState.FUTURE,
    };
    augurEmitter.emit(SubscriptionEventNames.DisputeWindowCreated, Object.assign({}, log, disputeWindowToInsert));
    await db.from("dispute_windows").insert(disputeWindowToInsert);
    // Re-running this is important for if the DisputeWindow was created on the same block it started (not pre-created as part of getOrCreateNext)
    await advanceDisputeWindowActive(db, augur, log.blockNumber, getCurrentTime());
    // throw new Error("HI");
  };
}

export async function processDisputeWindowCreatedLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    augurEmitter.emit(SubscriptionEventNames.DisputeWindowCreated, log);
    await db.from("dispute_windows").where({ disputeWindow: log.disputeWindow }).del();
  };
}

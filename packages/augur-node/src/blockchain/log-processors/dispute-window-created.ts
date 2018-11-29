import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, Address, DisputeWindowState } from "../../types";
import { augurEmitter } from "../../events";
import { advanceDisputeWindowActive, getCurrentTime } from "../process-block";
import { SubscriptionEventNames } from "../../constants";

export function processDisputeWindowCreatedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  augur.api.DisputeWindow.getFeeToken({ tx: { to: log.disputeWindow } }, (err: Error|null, feeToken?: Address): void => {
    if (err) return callback(err);
    const disputeWindowToInsert = {
      disputeWindow: log.disputeWindow,
      disputeWindowId: log.id,
      universe: log.universe,
      startTime: log.startTime,
      endTime: log.endTime,
      state: DisputeWindowState.FUTURE,
      fees: 0,
      feeToken,
    };
    augurEmitter.emit(SubscriptionEventNames.DisputeWindowCreated, Object.assign({}, log, disputeWindowToInsert));
    db.from("dispute_windows").insert(disputeWindowToInsert).asCallback((err) => {
      if (err) return callback(err);
      const disputeWindowTokens = [{
        contractAddress: log.disputeWindow,
        symbol: "ParticipationToken",
      }, {
        contractAddress: feeToken,
        symbol: `FeeToken`,
        disputeWindow: log.disputeWindow,
      }];
      db("tokens").insert(disputeWindowTokens).asCallback((err) => {
        if (err) return callback(err);
        // Re-running this is important for if the DisputeWindow was created on the same block it started (not pre-created as part of getOrCreateNext)
        advanceDisputeWindowActive(db, augur, log.blockNumber, getCurrentTime(), callback);
      });
    });
  });
}

export function processDisputeWindowCreatedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit(SubscriptionEventNames.DisputeWindowCreated, log);
  db.from("dispute_windows").where({ disputeWindow: log.disputeWindow }).del().asCallback((err) => {
    if (err) return callback(err);
    db("tokens").where("contractAddress", log.disputeWindow).orWhere("disputeWindow", log.disputeWindow).del().asCallback(callback);
  });
}

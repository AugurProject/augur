import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, Address, FeeWindowState } from "../../types";
import { augurEmitter } from "../../events";
import { advanceFeeWindowActive, getCurrentTime } from "../process-block";

export function processFeeWindowCreatedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  augur.api.FeeWindow.getFeeToken({ tx: { to: log.feeWindow } }, (err: Error|null, feeToken?: Address): void => {
    if (err) return callback(err);
    const feeWindowToInsert = {
      feeWindow: log.feeWindow,
      feeWindowId: log.id,
      universe: log.universe,
      startTime: log.startTime,
      endTime: log.endTime,
      state: FeeWindowState.FUTURE,
      fees: 0,
      feeToken,
    };
    augurEmitter.emit("FeeWindowCreated", Object.assign({}, log, feeWindowToInsert));
    db.from("fee_windows").insert(feeWindowToInsert).asCallback((err) => {
      if (err) return callback(err);
      const feeWindowTokens = [{
        contractAddress: log.feeWindow,
        symbol: "ParticipationToken",
      }, {
        contractAddress: feeToken,
        symbol: `FeeToken`,
        feeWindow: log.feeWindow,
      }];
      db("tokens").insert(feeWindowTokens).asCallback((err) => {
        if (err) return callback(err);
        // Re-running this is important for if the FeeWindow was created on the same block it started (not pre-created as part of getOrCreateNext)
        advanceFeeWindowActive(db, augur, log.blockNumber, getCurrentTime(), callback);
      });
    });
  });
}

export function processFeeWindowCreatedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit("FeeWindowCreated", log);
  db.from("fee_windows").where({ feeWindow: log.feeWindow }).del().asCallback((err) => {
    if (err) return callback(err);
    db("tokens").where("contractAddress", log.feeWindow).orWhere("feeWindow", log.feeWindow).del().asCallback(callback);
  });
}

import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, Address, FeeWindowState } from "../../types";
import { augurEmitter } from "../../events";
import { advanceFeeWindowActive, getCurrentTime } from "../process-block";
import { SubscriptionEventNames } from "../../constants";

export function processFeeWindowCreatedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  augur.api.FeeWindow.getFeeToken({ tx: { to: log.feeWindow } }, async (err: Error|null, feeToken?: Address) => {
    if (err) return callback(err);
    await new Promise(async (resolve) => {
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
      augurEmitter.emit(SubscriptionEventNames.FeeWindowCreated, Object.assign({}, log, feeWindowToInsert));
      await db.from("fee_windows").insert(feeWindowToInsert);
      const feeWindowTokens = [{
        contractAddress: log.feeWindow,
        symbol: "ParticipationToken",
      }, {
        contractAddress: feeToken,
        symbol: `FeeToken`,
        feeWindow: log.feeWindow,
      }];
      await db("tokens").insert(feeWindowTokens);

      // Re-running this is important for if the FeeWindow was created on the same block it started (not pre-created as part of getOrCreateNext)
      await advanceFeeWindowActive(db, augur, log.blockNumber, getCurrentTime());
      resolve();
    }).then(() => callback(null)).catch(callback);
  });
}

export function processFeeWindowCreatedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit(SubscriptionEventNames.FeeWindowCreated, log);
  db.from("fee_windows").where({ feeWindow: log.feeWindow }).del().asCallback((err) => {
    if (err) return callback(err);
    db("tokens").where("contractAddress", log.feeWindow).orWhere("feeWindow", log.feeWindow).del().asCallback(callback);
  });
}

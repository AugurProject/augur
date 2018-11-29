import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, Address, FeeWindowState } from "../../types";
import { augurEmitter } from "../../events";
import { advanceFeeWindowActive, getCurrentTime } from "../process-block";
import { SubscriptionEventNames } from "../../constants";

export async function processFeeWindowCreatedLog(augur: Augur, log: FormattedEventLog) {
  const feeToken: Address = await augur.api.FeeWindow.getFeeToken({ tx: { to: log.feeWindow } });
  return async (db: Knex) => {
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
    // throw new Error("HI");
  };
}

export async function processFeeWindowCreatedLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    augurEmitter.emit(SubscriptionEventNames.FeeWindowCreated, log);
    await db.from("fee_windows").where({ feeWindow: log.feeWindow }).del();
    return db("tokens").where("contractAddress", log.feeWindow).orWhere("feeWindow", log.feeWindow).del();
  };
}

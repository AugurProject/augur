import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog } from "../../types";
import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";

export async function processInitialReporterRedeemedLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await db.from("initial_reports").where("marketId", log.market).update({ redeemed: true });
    augurEmitter.emit(SubscriptionEventNames.InitialReporterRedeemed, log);
  };
}


export async function processInitialReporterRedeemedLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await db.from("initial_reports").where("marketId", log.market).update({ redeemed: false });
    augurEmitter.emit(SubscriptionEventNames.InitialReporterRedeemed, log);
  };
}


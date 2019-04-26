import { Augur, FormattedEventLog } from "../../types";
import Knex from "knex";
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

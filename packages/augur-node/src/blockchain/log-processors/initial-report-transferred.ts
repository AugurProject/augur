import { Augur, FormattedEventLog } from "../../types";
import Knex from "knex";
import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";

export async function processInitialReporterTransferredLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await db.from("initial_reports").where("marketId", log.market).update({ reporter: log.to });
    augurEmitter.emit(SubscriptionEventNames.InitialReporterTransferred, log);
  };
}

export async function processInitialReporterTransferredLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await db.from("initial_reports").where("marketId", log.market).update({ reporter: log.from });
    augurEmitter.emit(SubscriptionEventNames.InitialReporterTransferred, log);
  };
}

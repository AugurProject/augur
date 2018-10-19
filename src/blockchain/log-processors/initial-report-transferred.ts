import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog } from "../../types";
import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";

export async function processInitialReporterTransferredLog(db: Knex, augur: Augur, log: FormattedEventLog) {
  await db.from("initial_reports").where("marketId", log.market).update({ reporter: log.to });
  augurEmitter.emit(SubscriptionEventNames.InitialReporterTransferred, log);
}

export async function processInitialReporterTransferredLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog) {
  await db.from("initial_reports").where("marketId", log.market).update({ reporter: log.from });
  augurEmitter.emit(SubscriptionEventNames.InitialReporterTransferred, log);
}

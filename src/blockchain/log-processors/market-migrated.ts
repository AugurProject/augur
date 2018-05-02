import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";

export function processMarketMigratedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.update({ universe: log.newUniverse, needsMigration: 0 }).into("markets").where("marketId", log.market).asCallback(callback);
}

export function processMarketMigratedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.update({ universe: log.originalUniverse, needsMigration: 1 }).into("markets").where("marketId", log.market).asCallback(callback);
}

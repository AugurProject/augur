import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";

export function processMarketMigratedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.update({ universe: log.newUniverse }).into("markets").where("marketId", log.market).asCallback(callback);
}

export function processMarketMigratedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.update({ universe: log.originalUniverse }).into("markets").where("marketId", log.market).asCallback(callback);
}

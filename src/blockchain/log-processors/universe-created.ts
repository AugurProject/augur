import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";

export function processUniverseCreatedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const universeToInsert = {
    universe: log.childUniverse,
    parentUniverse: log.parentUniverse,
  };
  db.insert(universeToInsert).into("universes").asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("UniverseCreated", log);
    callback(null);
  });
}

export function processUniverseCreatedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db("universes").where({universe: log.childUniverse}).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("UniverseCreated", log);
    callback(null);
  });
}

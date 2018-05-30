import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, Address } from "../../types";
import { insertPayout } from "./database";
import { augurEmitter } from "../../events";

export function processUniverseCreatedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  insertPayout( db, log.childUniverse, log.payoutNumerators, log.invalid, true, (err, payoutId) => {
    if (err) return callback(err);
    augur.api.Universe.getReputationToken({ tx: { to: log.childUniverse }}, (err: Error|null, reputationToken?: Address): void => {
      if (err) return callback(err);
      const universeToInsert = {
        universe: log.childUniverse,
        parentUniverse: log.parentUniverse,
        payoutId,
        reputationToken,
        forked: false,
      };
      db.insert(universeToInsert).into("universes").asCallback((err: Error|null): void => {
        if (err) return callback(err);
        augurEmitter.emit("UniverseCreated", log);
        const repToken = [{
          contractAddress: reputationToken,
          symbol: "REP",
        }];
        db("tokens").insert(repToken).asCallback((err) => {
          if (err) return callback(err);
          callback(null);
        });
      });
    });
  });
}

export function processUniverseCreatedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db("universes").where({universe: log.childUniverse}).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("UniverseCreated", log);
    callback(null);
  });
}

import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, Address, ReportingState } from "../../types";
import { insertPayout, updateMarketState } from "./database";
import { augurEmitter } from "../../events";

export function processUniverseForkedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  augur.api.Universe.getForkingMarket({ tx: { to: log.universe } }, (err: Error|null, forkingMarket?: Address): void => {
    if (err) return callback(err);
    if (forkingMarket == null) return callback(new Error(`Could not retrieve forking market for universe ${log.universe}`));
    db("markets").update("forking", 1).where("marketId", forkingMarket).asCallback((err) => {
      if (err) return callback(err);
      updateMarketState(db, forkingMarket, log.blockNumber, ReportingState.FORKING, (err) => {
        if (err) return callback(err);
        callback(null);
        augurEmitter.emit("MarketState", {
          eventName: "MarketState",
          universe: log.universe,
          marketId: forkingMarket,
          reportingState: augur.constants.REPORTING_STATE.FORKING,
        });
      });
    });
  });
}

export function processUniverseForkedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db("markets").select("marketId").where("forking", 1).first().asCallback((err, forkingMarket?: Address) => {
    if (err) return callback(err);
    if (forkingMarket == null) return callback(new Error(`Could not retrieve forking market to rollback for universe ${log.universe}`));
    db("markets").update("forking", 0).where("marketId", forkingMarket).asCallback((err) => {
      if (err) return callback(err);
      augurEmitter.emit("MarketState", {
        eventName: "MarketState",
        universe: log.universe,
        marketId: forkingMarket,
        reportingState: augur.constants.REPORTING_STATE.CROWDSOURCING_DISPUTE,
        removed: true,
      });
      callback(null);
    });
  });
}

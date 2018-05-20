import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, Address, ReportingState } from "../../types";
import { updateMarketState } from "./database";
import { augurEmitter } from "../../events";

export function processUniverseForkedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  augur.api.Universe.getForkingMarket({ tx: { to: log.universe } }, (err: Error|null, forkingMarket?: Address): void => {
    if (err) return callback(err);
    if (forkingMarket == null) return callback(new Error(`Could not retrieve forking market for universe ${log.universe}`));
    db("markets").update("forking", 1).where("marketId", forkingMarket).asCallback((err) => {
      if (err) return callback(err);
      updateMarketState(db, forkingMarket, log.blockNumber, ReportingState.FORKING, (err) => {
        if (err) return callback(err);
        augurEmitter.emit("MarketState", {
          eventName: "MarketState",
          universe: log.universe,
          marketId: forkingMarket,
          reportingState: ReportingState.FORKING,
        });
        db("markets").increment("needsDisavowal", 1).where({ universe: log.universe }).whereNot("marketId", forkingMarket)
          .asCallback((err) => {
            if (err) return callback(err);
            db("universes").update("forked", true).where({ universe: log.universe }).asCallback(callback);
          });
      });
    });
  });
}

export function processUniverseForkedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db("markets").select("marketId").where({ forking: 1, universe: log.universe }).first().asCallback((err, forkingMarket?: { marketId: Address }) => {
    if (err) return callback(err);
    if (forkingMarket == null) return callback(new Error(`Could not retrieve forking market to rollback for universe ${log.universe}`));
    db("markets").update("forking", 0).where("marketId", forkingMarket.marketId).asCallback((err) => {
      if (err) return callback(err);
      augurEmitter.emit("MarketState", {
        eventName: "MarketState",
        universe: log.universe,
        marketId: forkingMarket,
        reportingState: ReportingState.CROWDSOURCING_DISPUTE,
      });
      db("markets").decrement("needsDisavowal", 1).where({ universe: log.universe }).whereNot("marketId", forkingMarket.marketId).asCallback((err) => {
        if (err) return callback(err);
        db("universes").update("forked", false).where({ universe: log.universe }).asCallback(callback);
      });
    });
  });
}

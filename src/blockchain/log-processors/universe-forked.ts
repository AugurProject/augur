import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, Address, ReportingState, MarketsContractAddressRow } from "../../types";
import { updateMarketState } from "./database";
import { augurEmitter } from "../../events";
import { getMarketsWithReportingState } from "../../server/getters/database";
import { forEach } from "async";

// set all crowdsourcers completed to 0, and markets.disputeRounds = null if no initial report, 0 if there is
function uncompleteNonforkingCrowdsourcers(db: Knex, universe: Address, forkingMarket: Address, callback: ErrorCallback) {
  db("crowdsourcers").update("completed", 0)
    .whereIn("marketId", (queryBuilder) => queryBuilder.from("markets").select("marketId").where({ universe }).whereNot("marketId", forkingMarket))
    .asCallback((err) => {
      if (err) return callback(err);
      db("markets").update({ disputeRounds: null }).where({ universe }).whereNot("marketId", forkingMarket).asCallback((err) => {
        if (err) return callback(err);
        db("markets").update({ disputeRounds: 0 }).where({ universe }).whereNot("marketId", forkingMarket)
          .whereIn("marketId", (queryBuilder) => queryBuilder.from("initial_reports").select("marketId"))
          .asCallback(callback);
      });
    });
}

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
            db("universes").update("forked", true).where({ universe: log.universe }).asCallback((err: Error|null) => {
              if (err) return callback(err);
              getMarketsWithReportingState(db).from("markets").select("markets.marketId")
                .where({ universe: log.universe })
                .whereIn("reportingState", [ReportingState.AWAITING_FINALIZATION, ReportingState.CROWDSOURCING_DISPUTE, ReportingState.AWAITING_NEXT_WINDOW])
                .asCallback((err, marketsToRevert?: Array<MarketsContractAddressRow>) => {
                  if (err || marketsToRevert == null) return callback(err);
                  forEach(marketsToRevert, (marketIdRow: MarketsContractAddressRow, nextMarketId: ErrorCallback): void => {
                    updateMarketState(db, marketIdRow.marketId, log.blockNumber, ReportingState.AWAITING_FORK_MIGRATION, (err) => {
                      if (err) return nextMarketId(err);
                      augurEmitter.emit("MarketState", {
                        eventName: "MarketState",
                        universe: log.universe,
                        marketId: marketIdRow.marketId,
                        reportingState: ReportingState.AWAITING_FORK_MIGRATION,
                      });
                      db("payouts").where({ marketId: marketIdRow.marketId }).update({winning: db.raw("null"), tentativeWinning: 0}).asCallback((err: Error|null) => {
                        if (err) return callback(err);
                        db("payouts").update("tentativeWinning", 1)
                          .join("initial_reports", "payouts.payoutId", "initial_reports.payoutId")
                          .where({ marketId: marketIdRow.marketId })
                          .asCallback(nextMarketId);
                      });
                    });
                  }, (err) => {
                    if (err) return callback(err);
                    uncompleteNonforkingCrowdsourcers(db, log.universe, forkingMarket, callback);
                  });
                });
            });
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

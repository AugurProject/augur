import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, Address, AsyncCallback } from "../../types";
import { refreshMarketMailboxEthBalance, rollbackMarketState, updateMarketState } from "./database";
import { parallel } from "async";

function flagMarketsNeedingMigration(db: Knex, finalizedMarketId: Address, universe: Address, callback: ErrorCallback) {
  db("markets").first("forking").where("marketId", finalizedMarketId).asCallback((err, isForkingMarket: {forking: number}) => {
    if (err) return callback(err);
    if (isForkingMarket.forking !== 1) return callback(null);
    db("markets").increment("needsMigration", 1).where({ universe }).whereNot("marketId", finalizedMarketId).asCallback(callback);
  });
}

export function processMarketFinalizedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  parallel([
    (next) => updateMarketState(db, log.market, log.blockNumber, augur.constants.REPORTING_STATE.FINALIZED, next),
    (next) => db("markets").where({ marketId: log.market }).update({ finalizationBlockNumber: log.blockNumber }).asCallback(next),
    (next) => flagMarketsNeedingMigration(db, log.market, log.universe, next),
    (next: AsyncCallback) => refreshMarketMailboxEthBalance(db, augur, log.market, next),
], (err: Error|null): void => {
    if (err) return callback(err);
    callback(null);
  });
}

export function processMarketFinalizedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  parallel([
    (next) => rollbackMarketState(db, log.market, augur.constants.REPORTING_STATE.FINALIZED, next),
    (next) => db("markets").where({ marketId: log.market }).update({ finalizationBlockNumber: null }).asCallback(next),
    (next) => db("markets").where({ universe: log.universe }).update({ needsMigration: 0 }).asCallback(next),
    (next: AsyncCallback) => refreshMarketMailboxEthBalance(db, augur, log.market, next),
  ], (err: Error|null): void => {
    if (err) return callback(err);
    callback(null);
  });
}

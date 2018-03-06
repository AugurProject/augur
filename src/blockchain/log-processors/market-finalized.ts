import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";
import { rollbackMarketState, updateMarketState } from "./database";
import { parallel } from "async";

export function processMarketFinalizedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  parallel([
    (next) => updateMarketState(db, log.market, log.blockNumber, augur.constants.REPORTING_STATE.FINALIZED, next),
    (next) => db("payouts").where({ marketId: log.market, tentativeWinning: 1 }).update("winning", 1).asCallback(next),
  ], (err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("MarketFinalized", log);
    callback(null);
  });
}

export function processMarketFinalizedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  parallel([
    (next) => rollbackMarketState(db, log.market, augur.constants.REPORTING_STATE.FINALIZED, next),
    (next) => db("payouts").where({ marketId: log.market }).update({winning: null}).asCallback(next),
  ], (err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("MarketFinalized", log);
    callback(null);
  });
}

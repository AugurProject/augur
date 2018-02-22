import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";
import { updateMarketState } from "./database";

export function processMarketFinalizedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  updateMarketState( db, log.market, log.blockNumber, augur.constants.REPORTING_STATE.FINALIZED, (err: Error|null): void => {
    if (null) return callback(err);
    augurEmitter.emit("MarketFinalized", log);
    callback(null);
  });
}

export function processMarketFinalizedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db("market_state").delete().where({marketId: log.market, reportingState: augur.constants.REPORTING_STATE.FINALIZED}).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    db("market_state").max("marketStateId as previousMarketStateId").first().where({marketId: log.market}).asCallback((err: Error|null, {previousMarketStateId }: {previousMarketStateId: number}): void => {
      if (err) return callback(err);
      db("markets").update({marketStateId: previousMarketStateId}).where({marketId: log.market }).asCallback((err: Error|null): void => {
        if (err) return callback(err);
        augurEmitter.emit("MarketFinalized", log);
        callback(null);
      });
    });
  });
}

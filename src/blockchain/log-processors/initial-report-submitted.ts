import Augur from "augur.js";
import * as Knex from "knex";
import { parallel } from "async";
import { FormattedEventLog, ErrorCallback, AsyncCallback, Address } from "../../types";
import { updateMarketState, rollbackMarketState, insertPayout } from "./database";
import { augurEmitter } from "../../events";

export function processInitialReportSubmittedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  updateMarketState( db, log.market, log.blockNumber, augur.constants.REPORTING_STATE.AWAITING_NEXT_WINDOW, (err: Error|null): void => {
    if (err) return callback(err);
    insertPayout( db, log.market, log.payoutNumerators, log.invalid, true, (err, payoutId) => {
      const reportToInsert = {
        marketId: log.market,
        isDesignatedReporter: log.isDesignatedReporter,
        reporter: log.reporter,
        amountStaked: log.amountStaked,
        payoutId,
        redeemed: false,
      };
      parallel({
        initialReport: (next: AsyncCallback) => {
          augur.api.Market.getInitialReporter({ tx: { to: log.market }}, (err: Error|null, initialReporter?: Address): void => {
            if (err) return next(err);
            db.insert({ ...reportToInsert, initialReporter }).into("initial_reports").asCallback(next);
          });
        },
        initialReportSizeUpdate: (next: AsyncCallback) => {
          db("markets").update({initialReportSize: log.amountStaked}).where({marketId: log.market}).asCallback(next);
        },
      }, (err: Error|null): void => {
        if (err) return callback(err);
        augurEmitter.emit("InitialReportSubmitted", log);
        callback(null);
      });
    });
  });
}

export function processInitialReportSubmittedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  parallel(
    {
      marketState: (next: AsyncCallback) => {
        rollbackMarketState(db, log.market, augur.constants.REPORTING_STATE.AWAITING_NEXT_WINDOW, (err: Error|null) => {
          if (err) return callback(err);
          db("initial_reports").delete().where({marketId: log.market}).asCallback(next);
        });
      },
      initialReportSize: (next: AsyncCallback) => {
        db("markets").update({initialReportSize: null}).where({marketId: log.market}).asCallback(next);
      },
    }, (err: Error|null): void => {
      if (err) return callback(err);
      augurEmitter.emit("InitialReportSubmitted", log);
      callback(null);
    },
  );
}

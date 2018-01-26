import Augur from "augur.js";
import * as Knex from "knex";
import { parallel } from "async";
import { FormattedEventLog, ErrorCallback, Address, AsyncCallback } from "../../types";
import { updateMarketState, insertPayout } from "./database";
import { augurEmitter } from "../../events";

export function processInitialReportSubmittedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  updateMarketState( db, log.market, trx, log.blockNumber, augur.constants.REPORTING_STATE.DESIGNATED_DISPUTE, (err: Error|null): void => {
    insertPayout( db, trx, log.market, log.payoutNumerators, false, (err, payoutID) => {
      const reportToInsert = {
        marketID: log.market,
        isDesignatedReporter: log.isDesignatedReporter,
        payoutID,
      };
      parallel({
        initialReport: (next: AsyncCallback) => {
          db.transacting(trx).insert(reportToInsert).into("initial_reports").asCallback(next);
        },
        initialReportSizeUpdate: (next: AsyncCallback) => {
          db("markets").transacting(trx).update({initialReportSize: log.amountStaked}).where({marketID: log.market}).asCallback(next);
        },
      }, (err: Error|null): void => {
        if (err) return callback(err);
        augurEmitter.emit("InitialReportSubmitted", log);
        callback(null);
      });
    });
  });
}

export function processInitialReportSubmittedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  parallel(
    {
      marketState: (next: AsyncCallback) => {
        db("market_state").transacting(trx).delete().where({marketID: log.market, reportingState: augur.constants.REPORTING_STATE.DESIGNATED_DISPUTE}).asCallback((err: Error|null): void => {
          if (err) return callback(err);
          db("market_state").transacting(trx).max("marketStateID as previousMarketStateID").first().where({marketID: log.market}).asCallback((err: Error|null, {previousMarketStateID }: {previousMarketStateID: number}): void => {
            if (err) return callback(err);
            db("markets").transacting(trx).update({marketStateID: previousMarketStateID}).where({marketID: log.market }).asCallback((err: Error|null) => {
              if (err) return callback(err);
              db("initial_reports").transacting(trx).delete().where({marketID: log.market}).asCallback(next);
            });
          });
        });
      },
      initialReportSize: (next: AsyncCallback) => {
        db("markets").transacting(trx).update({initialReportSize: null}).where({marketID: log.market}).asCallback(next);
      },
    }, (err: Error|null): void => {
      if (err) return callback(err);
      augurEmitter.emit("InitialReportSubmitted", log);
      callback();
    });

}

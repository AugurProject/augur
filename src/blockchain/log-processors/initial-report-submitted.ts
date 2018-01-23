import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, Address } from "../../types";
import { updateMarketState } from "./database";
import { augurEmitter } from "../../events";

export function insertPayout(db: Knex, trx: Knex.Transaction, marketID: Address, payoutNumerators: Array<string|number|null>, invalid: boolean, callback: (err: Error|null, payoutID?: number) => void): void {
  const payoutRow: { [index: string]: string|number|boolean|null } = {
    marketID,
    isInvalid: invalid,
  };
  payoutNumerators.forEach((value: number, i: number): void => {
    payoutRow["payout" + i] = value;
  });
  db.transacting(trx).select("payoutID").from("payouts").where(payoutRow).first().asCallback( (err: Error|null, payoutID?: number|null): void => {
    if (err) return callback(err);
    if (payoutID != null) {
      return callback(null, payoutID);
    } else {
      // Does not exist, proceed with insert
      db.transacting(trx).insert(payoutRow).returning("payoutID").into("payouts").asCallback((err: Error|null, payoutIDRow?: Array<number>): void => {
        if (err) callback(err);
        if (!payoutIDRow || !payoutIDRow.length) return callback(new Error("No payoutID returned"));
        callback(err, payoutIDRow[0]);
      });
    }
  });
}

export function processInitialReportSubmittedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  updateMarketState( db, log.market, trx, log.blockNumber, augur.constants.REPORTING_STATE.DESIGNATED_DISPUTE, (err: Error|null): void => {
    insertPayout( db, trx, log.market, log.payoutNumerators, false, (err, payoutID) => {
      const reportToInsert = {
        marketID: log.market,
        isDesignatedReporter: log.isDesignatedReporter,
        payoutID,
      };
      db.transacting(trx).insert(reportToInsert).into("initial_reports").asCallback(callback);
    });
  });
}

export function processInitialReportSubmittedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit("DesignatedReportSubmitted", log);
  db("market_state").transacting(trx).delete().where({marketID: log.market, reportingState: augur.constants.REPORTING_STATE.DESIGNATED_DISPUTE}).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    db("market_state").transacting(trx).max("marketStateID as previousMarketStateID").first().where({marketID: log.market}).asCallback((err: Error|null, {previousMarketStateID }: {previousMarketStateID: number}): void => {
      if (err) return callback(err);
      db("markets").transacting(trx).update({marketStateID: previousMarketStateID}).where({marketID: log.market }).asCallback((err: Error|null) => {
        if (err) return callback(err);
        db("initial_reports").transacting(trx).delete().where({marketID: log.market}).asCallback(callback);
      });
    });
  });
}

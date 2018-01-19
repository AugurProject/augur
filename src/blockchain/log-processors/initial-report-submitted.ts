import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, Address } from "../../types";
import { updateMarketState } from "./database";
import { augurEmitter } from "../../events";

/*
          "name": "universe",
          "type": "address"

          "name": "reporter",
          "type": "address"

          "name": "market",
          "type": "address"

          "name": "amountStaked",
          "type": "uint256"

          "name": "isDesignatedReporter",
          "type": "bool"

          "name": "payoutNumerators",
          "type": "uint256[]"
          */

  
export function processInitialReportSubmittedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  updateMarketState( db, log.market, trx, log.blockNumber, augur.constants.REPORTING_STATE.DESIGNATED_DISPUTE, (err: Error|null): void => {
    db.transacting(trx).insert({marketID: log.market, stakeToken: log.stakeToken}).into("reports_designated").asCallback(callback);
  });
}

export function processInitialReportSubmittedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit("DesignatedReportSubmitted", log);
  db("market_state").transacting(trx).delete().where({marketID: log.market, reportingState: augur.constants.REPORTING_STATE.DESIGNATED_DISPUTE}).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    db("market_state").transacting(trx).max("marketStateID as previousMarketStateID").first().where({marketID: log.market}).asCallback((err: Error|null, {previousMarketStateID }: {previousMarketStateID: number}): void => {
      if (err) return callback(err);
      db("markets").transacting(trx).update({marketStateID: previousMarketStateID}).where({marketID: log.market }).asCallback(callback);
    });
  });
}

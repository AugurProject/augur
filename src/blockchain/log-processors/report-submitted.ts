import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { insertPayout } from "./database";
import { augurEmitter } from "../../events";

export function processReportSubmittedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  insertPayout(db, log.market, log.payoutNumerators, false, false, (err: Error|null) => {
    if (err) return callback(err);
    db("market_state").first("market_state.reportingState as reportingState").join("markets", "markets.marketStateId", "market_state.marketStateId").where("markets.marketId", log.market).asCallback( (err: Error|null, { reportingState }: {reportingState: string}): void => {
      if (err) return callback(err);
      const reportDataToInsert: { [index: string]: string|number|boolean } = {
        marketId: log.market,
        stakeToken: log.stakeToken,
        blockNumber: log.blockNumber,
        reporter: log.reporter,
        transactionHash: log.transactionHash,
        logIndex: log.logIndex,
        amountStaked: log.amountStaked,
        marketReportingState: reportingState,
        claimed: 0,
      };
      augurEmitter.emit("ReportSubmitted", reportDataToInsert);
      db.insert(reportDataToInsert).into("reports").asCallback(callback);
    });
  });
}

export function processReportSubmittedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit("ReportSubmitted", log);
  db.from("reports").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback(callback);
}

import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { insertStakeToken } from "./designated-report-submitted";

// ReportSubmitted(address indexed universe, address indexed reporter, address indexed market, address stakeToken, uint256 amountStaked, uint256[] payoutNumerators);

export function processReportSubmittedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  insertStakeToken(db, trx, log.stakeToken, log.market, log.payoutNumerators, (err: Error|null) => {
    if (err) return callback(err);
    // console.log(    trx("market_state").first("market_state.reportingState as reportingState").join("markets","markets.marketStateID","market_state.marketStateID").where({marketID: log.market}).toSQL());
    trx("market_state").first("market_state.reportingState as reportingState").join("markets", "markets.marketStateID", "market_state.marketStateID").where("markets.marketID", log.market).asCallback( (err: Error|null, { reportingState }: {reportingState: string}): void => {
      if (err) return callback(err);
      const reportDataToInsert: { [index: string]: string|number|boolean } = {
        marketID: log.market,
        stakeToken: log.stakeToken,
        blockNumber: log.blockNumber,
        reporter: log.reporter,
        transactionHash: log.transactionHash,
        logIndex: log.logIndex,
        amountStaked: log.amountStaked,
        marketReportingState: reportingState,
        claimed: 0,
      };
      db.transacting(trx).insert(reportDataToInsert).into("reports").asCallback(callback);
    });
  });
}

export function processReportSubmittedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db.transacting(trx).from("reports").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback(callback);
}

import * as Knex from "knex";
import { Address, AsyncCallback, FeeWindowRow, UIFeeWindowCurrent } from "../../types";
import { parallel } from "async";
import { BigNumber } from "bignumber.js";

interface StakeRows {
  Disputes: { totalDisputeStake: string|null };
  InitialReports: { totalInitialReportSize: string|null };
}

export function getFeeWindowCurrent(db: Knex, universe: Address, reporter: Address|null, callback: (err?: Error|null, result?: UIFeeWindowCurrent|null) => void): void {
  if (universe == null) return callback(new Error("Must provide universe"));
  const query = db.select(
    [
      "endBlockNumber",
      "endTime",
      "feeWindow",
      "feeWindowId",
      "startBlockNumber",
      "startTime",
      "universe",
    ]).first().from("fee_windows")
    .whereNull("endBlockNumber")
    .where({ universe })
    .orderBy("startTime", "ASC");

  query.asCallback((err: Error|null, feeWindowRow?: FeeWindowRow): void => {
    if (err) return callback(err);
    if (!feeWindowRow) return callback(null, null);
    if (reporter == null) {
      return callback(null, feeWindowRow);
    } else {
      // populate account element
      const initialReportQuery = db.first().sum("markets.initialReportSize as totalInitialReportSize").from("initial_reports")
        .join("markets", "markets.marketId", "initial_reports.marketId")
        .where("markets.feeWindow", feeWindowRow.feeWindow)
        .where("initial_reports.reporter", reporter);
      const disputesQuery = db.first().sum("disputes.amountStaked as totalDisputeStake").from("disputes")
        .join("crowdsourcers", "crowdsourcers.crowdsourcerId", "disputes.crowdsourcerId")
        .join("markets", "markets.marketId", "crowdsourcers.marketId")
        .where("markets.feeWindow", feeWindowRow.feeWindow)
        .where("disputes.reporter", reporter);
      parallel({
        InitialReports: (next: AsyncCallback) => initialReportQuery.asCallback(next),
        Disputes: (next: AsyncCallback) => disputesQuery.asCallback(next),
      }, (err: Error|null, stakes: StakeRows): void => {
        if (err) return callback(err);
        if (stakes == null || stakes.InitialReports == null || stakes.Disputes == null) return callback(new Error("Bad results from stake query"));
        const totalStake = new BigNumber(stakes.InitialReports.totalInitialReportSize || 0, 10)
          .plus(new BigNumber(stakes.Disputes.totalDisputeStake || 0, 10));
        callback(null, Object.assign(
          {},
          feeWindowRow,
          { totalStake: totalStake.toFixed() },
        ));
      });
    }
  });
}

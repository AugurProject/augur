import * as Knex from "knex";
import { Address, AsyncCallback, FeeWindowRow, UIFeeWindowCurrent } from "../../types";
import { parallel } from "async";
import { BigNumber } from "bignumber.js";
import { sumBy } from "./database";
import { ZERO } from "../../constants";

interface StakeRows {
  totalDisputeStake: BigNumber|null|undefined;
  totalInitialReportSize: BigNumber|null|undefined;
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
      const initialReportQuery = db.select("markets.initialReportSize").from("initial_reports")
        .join("markets", "markets.marketId", "initial_reports.marketId")
        .where("markets.feeWindow", feeWindowRow.feeWindow)
        .where("initial_reports.reporter", reporter);

      const disputesQuery = db.select("disputes.amountStaked").from("disputes")
        .join("crowdsourcers", "crowdsourcers.crowdsourcerId", "disputes.crowdsourcerId")
        .join("markets", "markets.marketId", "crowdsourcers.marketId")
        .where("markets.feeWindow", feeWindowRow.feeWindow)
        .where("disputes.reporter", reporter);

      parallel({
        totalInitialReportSize: (next: AsyncCallback) => {
          initialReportQuery.asCallback((err: Error|null, results: Array<{initialReportSize: BigNumber}>) => {
            if (err || results.length === 0) return next(err);

            const pick = sumBy(results, "initialReportSize");
            next(null, pick.initialReportSize);
          });
        },
        totalDisputeStake: (next: AsyncCallback) => {
          disputesQuery.asCallback((err: Error|null, results: Array<{amountStaked: BigNumber}>) => {
            if (err || results.length === 0) return next(err);

            next(null, sumBy(results, "amountStaked").amountStaked);
          });
        },
      }, (err: Error|null, stakes: StakeRows): void => {
        if (err) return callback(err);
        const totalStake = ( stakes.totalInitialReportSize || ZERO ).plus((stakes.totalDisputeStake || ZERO));
        callback(null, Object.assign(
          {},
          feeWindowRow,
          { totalStake: totalStake.toFixed() },
        ));
      });
    }
  });
}

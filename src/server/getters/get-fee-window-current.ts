import * as Knex from "knex";
import { Address, AsyncCallback, FeeWindowRow, FeeWindowState, UIFeeWindowCurrent } from "../../types";
import { parallel } from "async";
import { BigNumber } from "bignumber.js";
import { sumBy } from "./database";
import { ZERO } from "../../constants";
import { getCurrentTime } from "../../blockchain/process-block";
import Augur from "augur.js";

interface StakeRows {
  participantContributions: BigNumber;
  participationTokens: BigNumber;
}

function fabricateFeeWindow(db: Knex, augur: Augur, universe: Address, callback: (err?: Error|null, result?: UIFeeWindowCurrent<string>|null) => void) {
  db("universes").first("universe").where({ universe }).asCallback((err, universeRow) => {
    if (err) return callback(err);
    if (universeRow == null) return callback(null, null);
    const feeWindowId = Math.floor(getCurrentTime() / augur.constants.CONTRACT_INTERVAL.DISPUTE_ROUND_DURATION_SECONDS);
    const startTime = feeWindowId * augur.constants.CONTRACT_INTERVAL.DISPUTE_ROUND_DURATION_SECONDS;
    const endTime = (feeWindowId + 1) * augur.constants.CONTRACT_INTERVAL.DISPUTE_ROUND_DURATION_SECONDS;
    callback(null, {
      feeWindow: null,
      feeWindowId,
      startTime,
      endTime,
      universe,
    });
  });
}

export function getFeeWindowCurrent(db: Knex, augur: Augur, universe: Address, reporter: Address|null, callback: (err?: Error|null, result?: UIFeeWindowCurrent<string>|null) => void): void {
  if (universe == null) return callback(new Error("Must provide universe"));
  const query = db.select(
    [
      "endTime",
      "feeWindow",
      "feeWindowId",
      "startTime",
      "universe",
    ]).first().from("fee_windows")
    .where("state", FeeWindowState.CURRENT)
    .where({ universe });
  query.asCallback((err: Error|null, feeWindowRow?: FeeWindowRow): void => {
    if (err) return callback(err);
    if (!feeWindowRow) return fabricateFeeWindow(db, augur, universe, callback);
    if (reporter == null) {
      return callback(null, feeWindowRow);
    } else {
      const participantQuery = db.select("reporterBalance as amountStaked").from("all_participants")
        .join("markets", "markets.marketId", "all_participants.marketId")
        .where("markets.feeWindow", feeWindowRow.feeWindow)
        .where("reporter", reporter);

      const participationTokenQuery = db.first([
        "participationToken.balance AS amountStaked",
      ]).from("fee_windows")
        .join("balances AS participationToken", function () {
          this
            .on("participationToken.token", db.raw("fee_windows.feeWindow"))
            .andOn("participationToken.owner", db.raw("?", [reporter]));
        })
        .where("fee_windows.feeWindow", feeWindowRow.feeWindow);

      parallel({
        participantContributions: (next: AsyncCallback) => {
          participantQuery.asCallback((err: Error|null, results?: Array<{ amountStaked: BigNumber }>) => {
            if (err || results == null || results.length === 0) return next(err, ZERO);
            const pick = sumBy(results, "amountStaked");
            next(null, pick.amountStaked || ZERO);
          });
        },
        participationTokens: (next: AsyncCallback) => {
          participationTokenQuery.asCallback((err: Error|null, results?: { amountStaked: BigNumber }) => {
            if (err || results == null) return next(err, ZERO);
            next(null, results.amountStaked);
          });
        },
      }, (err: Error|null, stakes: StakeRows): void => {
        if (err) return callback(err);
        const totalStake = (stakes.participantContributions).plus((stakes.participationTokens));
        callback(null, Object.assign(
          {
            totalStake: totalStake.toFixed(),
            participantContributions: stakes.participantContributions.toFixed(),
            participationTokens: stakes.participationTokens.toFixed(),
          },
          feeWindowRow,
        ));
      });
    }
  });
}

import * as Knex from "knex";
import { Address, AsyncCallback, FeeWindowRow, FeeWindowState, UIFeeWindowCurrent } from "../../types";
import { series } from "async";
import { BigNumber } from "bignumber.js";
import { getCashAddress, groupByAndSum, sumBy } from "./database";
import { ZERO } from "../../constants";
import { getCurrentTime } from "../../blockchain/process-block";
import Augur from "augur.js";
import * as _ from "lodash";

interface StakeRows {
  participantContributions: ParticipantStake;
  participationTokens: BigNumber;
}

interface FeeWindowStakes {
  feeWindowEthFees: BigNumber;
  feeWindowRepStaked: BigNumber;
}

interface ParticipantStake {
  initial_report: BigNumber;
  crowdsourcer: BigNumber;
}

function fabricateFeeWindow(db: Knex, augur: Augur, universe: Address, callback: (err?: Error|null, result?: UIFeeWindowCurrent<string>|null) => void) {
  db("universes").first("universe").where({ universe }).asCallback((err, universeRow) => {
    if (err) return callback(err);
    if (universeRow == null) return callback(new Error("Universe does not exist"), null);
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

function getFeeWindowEthFees(db: Knex, augur: Augur, feeWindow: Address, next: AsyncCallback) {
  const feeWindowEthFeesQuery = db("balances").first("balance")
    .where("owner", feeWindow)
    .where("token", getCashAddress(augur));
  feeWindowEthFeesQuery.asCallback((err: Error|null, results?: { balance: BigNumber }) => {
    if (err || results == null) return next(err, ZERO);
    next(null, results.balance);
  });
}

function getFeeWindowRepStaked(db: Knex, feeWindow: Address, feeToken: Address, next: AsyncCallback) {
  const feeWindowRepStakedQuery = db("token_supply").select("supply")
    .whereIn("token_supply.token", [feeWindow, feeToken]);
  feeWindowRepStakedQuery.asCallback((err: Error|null, results?: Array<{ supply: BigNumber }>) => {
    if (err || results == null || results.length === 0) return next(err, ZERO);
    next(null, sumBy(results, "supply").supply);
  });
}

function getParticipantContributions(db: Knex, feeWindow: Address, reporter: Address, next: AsyncCallback) {
  const participantQuery = db.select("type", "reporterBalance as amountStaked").from("all_participants")
    .where("feeWindow", feeWindow)
    .where("reporter", reporter);
  participantQuery.asCallback((err: Error|null, results?: Array<{ amountStaked: BigNumber; type: string }>) => {
    if (err || results == null) return next(err);
    const pick = _.keyBy(groupByAndSum(results, ["type"], ["amountStaked"]), "type");
    next(null, {
      initial_report: pick.initial_report ? pick.initial_report.amountStaked : ZERO,
      crowdsourcer: pick.crowdsourcer ? pick.crowdsourcer.amountStaked : ZERO,
    });
  });
}

function getParticipationTokens(db: Knex, feeWindow: Address, reporter: Address, next: AsyncCallback) {
  const participationTokenQuery = db.first([
    "participationToken.balance AS amountStaked",
  ]).from("fee_windows")
    .join("balances AS participationToken", function () {
      this
        .on("participationToken.token", db.raw("fee_windows.feeWindow"))
        .andOn("participationToken.owner", db.raw("?", [reporter]));
    })
    .where("fee_windows.feeWindow", feeWindow);
  participationTokenQuery.asCallback((err: Error|null, results?: { amountStaked: BigNumber }) => {
    if (err || results == null) return next(err, ZERO);
    next(null, results.amountStaked);
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
      "feeToken",
    ]).first().from("fee_windows")
    .where("state", FeeWindowState.CURRENT)
    .where({ universe });
  query.asCallback((err: Error|null, feeWindowRow?: FeeWindowRow): void => {
    if (err) return callback(err);
    if (!feeWindowRow) return fabricateFeeWindow(db, augur, universe, callback);
    series({
      feeWindowEthFees: (next: AsyncCallback) => getFeeWindowEthFees(db, augur, feeWindowRow.feeWindow, next),
      feeWindowRepStaked: (next: AsyncCallback) => getFeeWindowRepStaked(db, feeWindowRow.feeWindow, feeWindowRow.feeToken, next),
    }, (err: Error|null, stakes: FeeWindowStakes): void => {
      if (err) return callback(err);
      const feeWindowResponse = Object.assign({
        feeWindowEthFees: stakes.feeWindowEthFees.toFixed(),
        feeWindowRepStaked: stakes.feeWindowRepStaked.toFixed(),
      }, feeWindowRow);
      if (reporter == null) {
        return callback(null, feeWindowResponse);
      }
      series({
        participantContributions: (next: AsyncCallback) => getParticipantContributions(db, feeWindowRow.feeWindow, reporter, next),
        participationTokens: (next: AsyncCallback) => getParticipationTokens(db, feeWindowRow.feeWindow, reporter, next),
      }, (err: Error|null, stakes: StakeRows): void => {
        if (err) return callback(err);
        const totalParticipantContributions = stakes.participantContributions.crowdsourcer.plus(stakes.participantContributions.initial_report);
        const totalStake = totalParticipantContributions.plus((stakes.participationTokens));
        callback(null, Object.assign(
          {
            totalStake: totalStake.toFixed(),
            participantContributions: totalParticipantContributions.toFixed(),
            participantContributionsInitialReport: stakes.participantContributions.initial_report.toFixed(),
            participantContributionsCrowdsourcer: stakes.participantContributions.crowdsourcer.toFixed(),
            participationTokens: stakes.participationTokens.toFixed(),
          }, feeWindowResponse,
        ));
      });
    });
  });
}

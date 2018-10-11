import * as Knex from "knex";
import { Address, AsyncCallback, FeeWindowRow, UIFeeWindowCurrent } from "../../types";
import { series } from "async";
import { BigNumber } from "bignumber.js";
import { getCashAddress, groupByAndSum} from "./database";
import { ZERO } from "../../constants";
import { getCurrentTime } from "../../blockchain/process-block";
import Augur from "augur.js";
import * as _ from "lodash";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";

const RELATIVE_FEE_WINDOW_STATE: {[state: string]: number} = {
  PREVIOUS: -1,
  CURRENT: 0,
  NEXT: 1,
};

interface StakeRows {
  participantContributions: ParticipantStake;
  participationTokens: BigNumber;
}

interface FeeWindowStakes {
  feeWindowEthFees: BigNumber;
  feeWindowRepStaked: {
    feeWindowRepStaked: BigNumber;
    feeWindowParticipationTokens: BigNumber;
    feeWindowFeetokens: BigNumber;
  };
}

interface ParticipantStake {
  initial_report: BigNumber;
  crowdsourcer: BigNumber;
}

function fabricateFeeWindow(db: Knex, augur: Augur, universe: Address, targetTime: number, callback: (err?: Error|null, result?: UIFeeWindowCurrent<string>|null) => void) {
  db("universes").first("universe").where({ universe }).asCallback((err, universeRow) => {
    if (err) return callback(err);
    if (universeRow == null) return callback(new Error("Universe does not exist"), null);
    const feeWindowId = Math.floor(targetTime / augur.constants.CONTRACT_INTERVAL.DISPUTE_ROUND_DURATION_SECONDS);
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

function getFeeWindowEthFees(db: Knex, augur: Augur, feeWindow: Address, callback: AsyncCallback) {
  const feeWindowEthFeesQuery = db("balances").first("balance")
    .where("owner", feeWindow)
    .where("token", getCashAddress(augur));
  feeWindowEthFeesQuery.asCallback((err: Error|null, results?: { balance: BigNumber }) => {
    if (err || results == null) return callback(err, ZERO);
    callback(null, results.balance);
  });
}

function getFeeWindowRepStaked(db: Knex, feeWindow: Address, feeToken: Address, callback: AsyncCallback) {
  const feeWindowRepStakedQuery = db("token_supply").select("token", "supply")
    .whereIn("token_supply.token", [feeWindow, feeToken]);
  feeWindowRepStakedQuery.asCallback((err: Error|null, results?: Array<{ supply: BigNumber }>) => {
    const result = _.keyBy(results, "token");
    const feeWindowParticipationTokens = result[feeWindow] ? result[feeWindow].supply : ZERO;
    const feeWindowFeeTokens = result[feeToken] ? result[feeToken].supply : ZERO;
    callback(null, {
      feeWindowParticipationTokens,
      feeWindowFeeTokens,
      feeWindowRepStaked: feeWindowParticipationTokens.plus(feeWindowFeeTokens),
    });
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

export function getFeeWindow(db: Knex, augur: Augur, universe: Address, reporter: Address|null, feeWindowState: "previous"|"current"|"next", feeWindow: Address|null, callback: (err?: Error|null, result?: UIFeeWindowCurrent<string>|null) => void): void {
  if (universe == null) return callback(new Error("Must provide universe"));
  if (feeWindowState == null && feeWindow == null) return callback(new Error("Must provide either a feeWindowState OR feeWindow"));
  const query = db.select(
    [
      "endTime",
      "feeWindow",
      "feeWindowId",
      "startTime",
      "universe",
      "feeToken",
    ]).first().from("fee_windows")
    .where({ universe });
  let targetTime: number|null = null;
  if (feeWindowState != null) {
    const feeWindowDelta = RELATIVE_FEE_WINDOW_STATE[feeWindowState.toUpperCase()];
    if (feeWindowDelta === undefined) return callback(new Error("Use feeWindowState PREVIOUS, CURRENT, or NEXT"));
    const feeWindowDuration = augur.constants.CONTRACT_INTERVAL.DISPUTE_ROUND_DURATION_SECONDS;
    targetTime = getCurrentTime() + feeWindowDuration * feeWindowDelta;
    query.whereBetween("startTime", [targetTime - feeWindowDuration, targetTime] );
  }
  if (feeWindow != null) query.where("feeWindow", feeWindow);

  query.asCallback((err: Error|null, feeWindowRow?: FeeWindowRow): void => {
    if (err) return callback(err);
    if (!feeWindowRow) {
      if (targetTime == null) return callback(new Error("No feeWindow found and cannot infer targetTime from parameters"));
      return fabricateFeeWindow(db, augur, universe, targetTime, callback);
    }
    series({
      feeWindowEthFees: (next: AsyncCallback) => getFeeWindowEthFees(db, augur, feeWindowRow.feeWindow, next),
      feeWindowRepStaked: (next: AsyncCallback) => getFeeWindowRepStaked(db, feeWindowRow.feeWindow, feeWindowRow.feeToken, next),
    }, (err: Error|null, stakes: FeeWindowStakes): void => {
      if (err) return callback(err);
      const feeWindowResponse = Object.assign({
        feeWindowEthFees: stakes.feeWindowEthFees.toString(),
      },
        formatBigNumberAsFixed(stakes.feeWindowRepStaked), feeWindowRow);
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
            totalStake: totalStake.toString(),
            participantContributions: totalParticipantContributions.toString(),
            participantContributionsInitialReport: stakes.participantContributions.initial_report.toString(),
            participantContributionsCrowdsourcer: stakes.participantContributions.crowdsourcer.toString(),
            participationTokens: stakes.participationTokens.toString(),
            participantParticipationTokens: stakes.participationTokens.toString(),
          }, feeWindowResponse,
        ));
      });
    });
  });
}

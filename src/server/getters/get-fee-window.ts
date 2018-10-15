import * as Knex from "knex";
import { Address, FeeWindowRow, UIFeeWindowCurrent } from "../../types";
import { BigNumber } from "bignumber.js";
import { getCashAddress, groupByAndSum } from "./database";
import { ZERO } from "../../constants";
import { getCurrentTime } from "../../blockchain/process-block";
import Augur from "augur.js";
import * as _ from "lodash";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import * as t from "io-ts";

export const FeeWindowParams = t.type({
  universe: t.string,
  reporter: t.union([t.string, t.null, t.undefined]),
  feeWindowState: t.union([t.string, t.null, t.undefined]),
  feeWindow: t.union([t.string, t.null, t.undefined]),
});

const RELATIVE_FEE_WINDOW_STATE: { [state: string]: number } = {
  PREVIOUS: -1,
  CURRENT: 0,
  NEXT: 1,
};

async function fabricateFeeWindow(db: Knex, augur: Augur, universe: Address, targetTime: number): Promise<UIFeeWindowCurrent<string>|null> {
  const universeRow = await db("universes").first("universe").where({ universe });
  if (universeRow == null) throw new Error("Universe does not exist");
  const feeWindowId = Math.floor(targetTime / augur.constants.CONTRACT_INTERVAL.DISPUTE_ROUND_DURATION_SECONDS);
  const startTime = feeWindowId * augur.constants.CONTRACT_INTERVAL.DISPUTE_ROUND_DURATION_SECONDS;
  const endTime = (feeWindowId + 1) * augur.constants.CONTRACT_INTERVAL.DISPUTE_ROUND_DURATION_SECONDS;
  return {
    feeWindow: null,
    feeWindowId,
    startTime,
    endTime,
    universe,
  };
}

async function getFeeWindowEthFees(db: Knex, augur: Augur, feeWindow: Address): Promise<BigNumber> {
  const feeWindowEthFeesQuery = db("balances").first("balance")
    .where("owner", feeWindow)
    .where("token", getCashAddress(augur));
  const results = await feeWindowEthFeesQuery;
  return results ? results.balance : ZERO;
}

async function getFeeWindowRepStaked(db: Knex, feeWindow: Address, feeToken: Address) {
  const feeWindowRepStakedQuery = db("token_supply").select("token", "supply")
    .whereIn("token_supply.token", [feeWindow, feeToken]);
  const results: Array<{ supply: BigNumber }> = await feeWindowRepStakedQuery;
  const result = _.keyBy(results, "token");
  const feeWindowParticipationTokens = result[feeWindow] ? result[feeWindow].supply : ZERO;
  const feeWindowFeeTokens = result[feeToken] ? result[feeToken].supply : ZERO;
  return {
    feeWindowParticipationTokens,
    feeWindowFeeTokens,
    feeWindowRepStaked: feeWindowParticipationTokens.plus(feeWindowFeeTokens),
  };
}

async function getParticipantContributions(db: Knex, feeWindow: Address, reporter: Address) {
  const participantQuery = db.select("type", "reporterBalance as amountStaked").from("all_participants")
    .where("feeWindow", feeWindow)
    .where("reporter", reporter);
  const results: Array<{ amountStaked: BigNumber; type: string }> = await participantQuery;
  const pick = _.keyBy(groupByAndSum(results, ["type"], ["amountStaked"]), "type");
  return {
    initial_report: pick.initial_report ? pick.initial_report.amountStaked : ZERO,
    crowdsourcer: pick.crowdsourcer ? pick.crowdsourcer.amountStaked : ZERO,
  };
}

async function getParticipationTokens(db: Knex, feeWindow: Address, reporter: Address) {
  const participationTokenQuery = db.first([
    "participationToken.balance AS amountStaked",
  ]).from("fee_windows")
    .join("balances AS participationToken", function () {
      this
        .on("participationToken.token", db.raw("fee_windows.feeWindow"))
        .andOn("participationToken.owner", db.raw("?", [reporter]));
    })
    .where("fee_windows.feeWindow", feeWindow);
  const results: { amountStaked: BigNumber } = await participationTokenQuery;
  return results ? results.amountStaked : ZERO;
}

export async function getFeeWindow(db: Knex, augur: Augur, params: t.TypeOf<typeof FeeWindowParams>): Promise<UIFeeWindowCurrent<string>|null> {
  if (params.feeWindowState == null && params.feeWindow == null) throw new Error("Must provide either a feeWindowState OR feeWindow");
  const query = db.select(
    [
      "endTime",
      "feeWindow",
      "feeWindowId",
      "startTime",
      "universe",
      "feeToken",
    ]).first().from("fee_windows")
    .where("universe", params.universe);
  let targetTime: number|null = null;
  if (params.feeWindowState != null) {
    const feeWindowDelta = RELATIVE_FEE_WINDOW_STATE[params.feeWindowState.toUpperCase()];
    if (feeWindowDelta === undefined) throw new Error("Use feeWindowState PREVIOUS, CURRENT, or NEXT");
    const feeWindowDuration = augur.constants.CONTRACT_INTERVAL.DISPUTE_ROUND_DURATION_SECONDS;
    targetTime = getCurrentTime() + feeWindowDuration * feeWindowDelta;
    query.whereBetween("startTime", [targetTime - feeWindowDuration, targetTime]);
  }
  if (params.feeWindow != null) query.where("feeWindow", params.feeWindow);

  const feeWindowRow: FeeWindowRow = await query;
  if (!feeWindowRow) {
    if (targetTime == null) throw new Error("No feeWindow found and cannot infer targetTime from parameters");
    return fabricateFeeWindow(db, augur, params.universe, targetTime);
  }
  const feeWindowEthFees = await getFeeWindowEthFees(db, augur, feeWindowRow.feeWindow);
  const feeWindowRepStaked = await getFeeWindowRepStaked(db, feeWindowRow.feeWindow, feeWindowRow.feeToken);
  const feeWindowResponse = Object.assign({
      feeWindowEthFees: feeWindowEthFees.toString(),
    },
    formatBigNumberAsFixed(feeWindowRepStaked), feeWindowRow);
  if (params.reporter == null) {
    return feeWindowResponse;
  }
  const participantContributions = await getParticipantContributions(db, feeWindowRow.feeWindow, params.reporter);
  const participationTokens = await getParticipationTokens(db, feeWindowRow.feeWindow, params.reporter);
  const totalParticipantContributions = participantContributions.crowdsourcer.plus(participantContributions.initial_report);
  const totalStake = totalParticipantContributions.plus(participationTokens);
  return Object.assign(
    {
      totalStake: totalStake.toString(),
      participantContributions: totalParticipantContributions.toString(),
      participantContributionsInitialReport: participantContributions.initial_report.toString(),
      participantContributionsCrowdsourcer: participantContributions.crowdsourcer.toString(),
      participationTokens: participationTokens.toString(),
      participantParticipationTokens: participationTokens.toString(),
    }, feeWindowResponse,
  );
}

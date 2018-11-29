import * as t from "io-ts";
import * as Knex from "knex";
import * as _ from "lodash";
import Augur from "augur.js";
import { Address, DisputeWindowRow, UIDisputeWindowCurrent } from "../../types";
import { BigNumber } from "bignumber.js";
import { getCashAddress, groupByAndSum } from "./database";
import { ZERO } from "../../constants";
import { getCurrentTime } from "../../blockchain/process-block";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";

export const DisputeWindowParams = t.type({
  universe: t.string,
  reporter: t.union([t.string, t.null, t.undefined]),
  disputeWindowState: t.union([t.string, t.null, t.undefined]),
  disputeWindow: t.union([t.string, t.null, t.undefined]),
});

const RELATIVE_FEE_WINDOW_STATE: { [state: string]: number } = {
  PREVIOUS: -1,
  CURRENT: 0,
  NEXT: 1,
};

async function fabricateDisputeWindow(db: Knex, augur: Augur, universe: Address, targetTime: number): Promise<UIDisputeWindowCurrent<string>|null> {
  const universeRow = await db("universes").first("universe").where({ universe });
  if (universeRow == null) throw new Error("Universe does not exist");
  const disputeWindowId = Math.floor(targetTime / augur.constants.CONTRACT_INTERVAL.DISPUTE_ROUND_DURATION_SECONDS);
  const startTime = disputeWindowId * augur.constants.CONTRACT_INTERVAL.DISPUTE_ROUND_DURATION_SECONDS;
  const endTime = (disputeWindowId + 1) * augur.constants.CONTRACT_INTERVAL.DISPUTE_ROUND_DURATION_SECONDS;
  return {
    disputeWindow: null,
    disputeWindowId,
    startTime,
    endTime,
    universe,
  };
}

async function getDisputeWindowEthFees(db: Knex, augur: Augur, disputeWindow: Address): Promise<BigNumber> {
  const disputeWindowEthFeesQuery = db("balances").first("balance")
    .where("owner", disputeWindow)
    .where("token", getCashAddress(augur));
  const results = await disputeWindowEthFeesQuery;
  return results ? results.balance : ZERO;
}

async function getDisputeWindowRepStaked(db: Knex, disputeWindow: Address, feeToken: Address) {
  const disputeWindowRepStakedQuery = db("token_supply").select("token", "supply")
    .whereIn("token_supply.token", [disputeWindow, feeToken]);
  const results: Array<{ supply: BigNumber }> = await disputeWindowRepStakedQuery;
  const result = _.keyBy(results, "token");
  const disputeWindowParticipationTokens = result[disputeWindow] ? result[disputeWindow].supply : ZERO;
  const disputeWindowFeeTokens = result[feeToken] ? result[feeToken].supply : ZERO;
  return {
    disputeWindowParticipationTokens,
    disputeWindowFeeTokens,
    disputeWindowRepStaked: disputeWindowParticipationTokens.plus(disputeWindowFeeTokens),
  };
}

async function getParticipantContributions(db: Knex, disputeWindow: Address, reporter: Address) {
  const participantQuery = db.select("type", "reporterBalance as amountStaked").from("all_participants")
    .where("disputeWindow", disputeWindow)
    .where("reporter", reporter);
  const results: Array<{ amountStaked: BigNumber; type: string }> = await participantQuery;
  const pick = _.keyBy(groupByAndSum(results, ["type"], ["amountStaked"]), "type");
  return {
    initial_report: pick.initial_report ? pick.initial_report.amountStaked : ZERO,
    crowdsourcer: pick.crowdsourcer ? pick.crowdsourcer.amountStaked : ZERO,
  };
}

async function getParticipationTokens(db: Knex, disputeWindow: Address, reporter: Address) {
  const participationTokenQuery = db.first([
    "participationToken.balance AS amountStaked",
  ]).from("dispute_windows")
    .join("balances AS participationToken", function () {
      this
        .on("participationToken.token", db.raw("dispute_windows.disputeWindow"))
        .andOn("participationToken.owner", db.raw("?", [reporter]));
    })
    .where("dispute_windows.disputeWindow", disputeWindow);
  const results: { amountStaked: BigNumber } = await participationTokenQuery;
  return results ? results.amountStaked : ZERO;
}

export async function getDisputeWindow(db: Knex, augur: Augur, params: t.TypeOf<typeof DisputeWindowParams>): Promise<UIDisputeWindowCurrent<string>|null> {
  if (params.disputeWindowState == null && params.disputeWindow == null) throw new Error("Must provide either a disputeWindowState OR disputeWindow");
  const query = db.select(
    [
      "endTime",
      "disputeWindow",
      "disputeWindowId",
      "startTime",
      "universe",
      "feeToken",
    ]).first().from("dispute_windows")
    .where("universe", params.universe);
  let targetTime: number|null = null;
  if (params.disputeWindowState != null) {
    const disputeWindowDelta = RELATIVE_FEE_WINDOW_STATE[params.disputeWindowState.toUpperCase()];
    if (disputeWindowDelta === undefined) throw new Error("Use disputeWindowState PREVIOUS, CURRENT, or NEXT");
    const disputeWindowDuration = augur.constants.CONTRACT_INTERVAL.DISPUTE_ROUND_DURATION_SECONDS;
    targetTime = getCurrentTime() + disputeWindowDuration * disputeWindowDelta;
    query.whereBetween("startTime", [targetTime - disputeWindowDuration, targetTime]);
  }
  if (params.disputeWindow != null) query.where("disputeWindow", params.disputeWindow);

  const disputeWindowRow: DisputeWindowRow = await query;
  if (!disputeWindowRow) {
    if (targetTime == null) throw new Error("No disputeWindow found and cannot infer targetTime from parameters");
    return fabricateDisputeWindow(db, augur, params.universe, targetTime);
  }
  const disputeWindowEthFees = await getDisputeWindowEthFees(db, augur, disputeWindowRow.disputeWindow);
  const disputeWindowRepStaked = await getDisputeWindowRepStaked(db, disputeWindowRow.disputeWindow, disputeWindowRow.feeToken);
  const disputeWindowResponse = Object.assign({
      disputeWindowEthFees: disputeWindowEthFees.toString(),
    },
    formatBigNumberAsFixed(disputeWindowRepStaked), disputeWindowRow);
  if (params.reporter == null) {
    return disputeWindowResponse;
  }
  const participantContributions = await getParticipantContributions(db, disputeWindowRow.disputeWindow, params.reporter);
  const participationTokens = await getParticipationTokens(db, disputeWindowRow.disputeWindow, params.reporter);
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
    }, disputeWindowResponse,
  );
}

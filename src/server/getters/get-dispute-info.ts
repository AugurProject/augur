import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { Address, MarketsRowWithCreationTime, AsyncCallback, Payout, UIStakeInfo, PayoutRow, ReportingState } from "../../types";
import { getMarketsWithReportingState, normalizePayouts } from "./database";
import { BigNumber } from "bignumber.js";
import { QueryBuilder } from "knex";
import { ZERO } from "../../constants";

interface DisputeRound {
  marketId: Address;
  disputeRound: number;
}

interface DisputesResult {
  markets: Array<MarketsRowWithCreationTime>;
  completedStakes: Array<StakeRow>;
  activeCrowdsourcer: Array<ActiveCrowdsourcer>;
  accountStakeComplete: Array<StakeRow>;
  accountStakeIncomplete: Array<StakeRow>;
  payouts: Array<PayoutRow>;
  disputeRound: Array<DisputeRound>;
}

interface StakeRow extends Payout {
  marketId: Address;
  amountStaked: number;
  payoutId: number;
}

interface ActiveCrowdsourcer extends StakeRow {
  size: number;
}

interface StakeSizes {
  size?: string;
  currentStake?: string;
  accountStakeComplete?: string;
  accountStakeIncomplete?: string;
}

const activeMarketStates = ["CROWDSOURCING_DISPUTE", "AWAITING_NEXT_WINDOW", "FORKING", "AWAITING_FORK_MIGRATION"];

function isActiveMarketState(reportingState: ReportingState|null|undefined) {
  if (reportingState == null) return null;
  return activeMarketStates.indexOf(reportingState) !== -1;
}

function calculateBondSize(totalCompletedStakeOnAllPayouts: BigNumber, completedStakeAmount: BigNumber): BigNumber {
  return new BigNumber(totalCompletedStakeOnAllPayouts.times(2))
    .minus(
      new BigNumber(completedStakeAmount).times(3));
}

export function getDisputeInfo(db: Knex, marketIds: Array<Address>, account: Address|null, callback: (err: Error|null, result?: Array<UIStakeInfo|null>) => void): void {
  if (marketIds == null) return callback(new Error("must include marketIds parameter"));
  const completedStake = db.select(["marketId", "payoutId", "amountStaked"]).from((builder: QueryBuilder) =>
    builder.from("crowdsourcers").select("marketId", "payoutId", "amountStaked").where("completed", 1).whereIn("marketId", marketIds).union((builder: QueryBuilder) =>
      builder.select(["marketId", "payoutId", "amountStaked"]).from("initial_reports").whereIn("marketId", marketIds),
    )).groupBy("marketId", "payoutId");

  // select crowdsourcers.marketId, crowdsourcers.payoutId, crowdsourcers.completed, sum(balances.balance) from crowdsourcers JOIN balances ON balances.token = crowdsourcers.crowdsourcerId;
  const accountStake = db.select(["crowdsourcers.marketId", "balances.owner", "crowdsourcers.payoutId"]).sum("balances.balance as amountStaked")
    .from("crowdsourcers").join("balances", "balances.token", "crowdsourcers.crowdsourcerId")
    .whereIn("marketId", marketIds)
    .where("balances.owner", account || "");

  parallel({
    markets: (next: AsyncCallback) => getMarketsWithReportingState(db).whereIn("markets.marketId", marketIds).asCallback(next),
    payouts: (next: AsyncCallback) => db("payouts").whereIn("marketId", marketIds).asCallback(next),
    completedStakes: (next: AsyncCallback) => completedStake.asCallback(next),
    activeCrowdsourcer: (next: AsyncCallback) => db("crowdsourcers").select(["marketId", "payoutId"]).sum("amountStaked as amountStaked").sum("size as size").groupBy(["crowdsourcers.marketId", "payoutId"]).whereNull("completed").whereIn("crowdsourcers.marketId", marketIds).asCallback(next),
    accountStakeIncomplete: (next: AsyncCallback) => accountStake.clone().whereNull("crowdsourcers.completed").asCallback(next),
    accountStakeComplete: (next: AsyncCallback) => accountStake.clone().where("crowdsourcers.completed", 1).asCallback(next),
    disputeRound: (next: AsyncCallback) => db("crowdsourcers").select("marketId").count("* as disputeRound").groupBy("crowdsourcers.marketId").where("crowdsourcers.completed", 1).whereIn("crowdsourcers.marketId", marketIds).asCallback(next),
  }, (err: Error|null, stakeResults: DisputesResult): void => {
    if (err) return callback(err);
    if (!stakeResults.markets) return callback(new Error("Could not retrieve markets"));

    const disputeDetailsByMarket: Array<DisputesResult> =
      _.map(marketIds, (marketId: Address) =>
        _.mapValues(stakeResults, (result) => _.filter(result, { marketId })),
      );
    callback(null, _.map(disputeDetailsByMarket, reshapeStakeRowToUIStakeInfo));
  });
}

function reshapeStakeRowToUIStakeInfo(stakeRows: DisputesResult): UIStakeInfo|null {
  const marketRow = stakeRows.markets[0];
  if (marketRow == null) {
    return null;
  }
  const totalCompletedStakeOnAllPayouts = new BigNumber(
    _.sum(_.map(stakeRows.completedStakes, (completedStake) => completedStake.amountStaked)));

  const completedStakeByPayout: { [payoutId: number]: StakeRow } = _.keyBy(stakeRows.completedStakes, "payoutId");
  const activeCrowdsourcerByPayout: { [payoutId: number]: ActiveCrowdsourcer } = _.keyBy(stakeRows.activeCrowdsourcer, "payoutId");
  const accountStakeCompleteByPayout: { [payoutId: number]: any } = _.keyBy(stakeRows.accountStakeComplete, "payoutId");
  const accountStakeIncompleteByPayout: { [payoutId: number]: any } = _.keyBy(stakeRows.accountStakeIncomplete, "payoutId");

  const stakeResults = _.map(stakeRows.payouts, (payout: PayoutRow) => {
    const completedStakes = completedStakeByPayout[payout.payoutId];
    const activeCrowdsourcer = activeCrowdsourcerByPayout[payout.payoutId];
    const accountStakeComplete = accountStakeCompleteByPayout[payout.payoutId];
    const accountStakeIncomplete = accountStakeIncompleteByPayout[payout.payoutId];

    const completedStakeAmount = new BigNumber(completedStakes == null ? 0 : completedStakes.amountStaked);
    const totalStakeOnPayout = completedStakeAmount.add(new BigNumber(activeCrowdsourcer == null ? 0 : activeCrowdsourcer.amountStaked));

    let currentAmounts: StakeSizes;
    if (payout.tentativeWinning === 1 || !isActiveMarketState(marketRow.reportingState)) {
      currentAmounts = {};
    } else if (activeCrowdsourcer == null) {
      currentAmounts = {
        size: calculateBondSize(totalCompletedStakeOnAllPayouts, completedStakeAmount).toFixed(),
        currentStake: ZERO.toFixed(),
        accountStakeIncomplete: ZERO.toFixed(),
      };
    } else {
      currentAmounts = {
        size: new BigNumber(activeCrowdsourcer.size).toFixed(),
        currentStake: new BigNumber(activeCrowdsourcer.amountStaked).toFixed(),
        accountStakeIncomplete: new BigNumber(accountStakeIncomplete === undefined ? 0 : accountStakeIncomplete.amountStaked ).toFixed(),
      };
    }

    currentAmounts.accountStakeComplete = new BigNumber(accountStakeComplete === undefined ? 0 : accountStakeComplete.amountStaked).toFixed();
    return Object.assign({},
      normalizePayouts(payout),
      currentAmounts,
      {
        totalStake: totalStakeOnPayout.toFixed(),
        completedStake: completedStakeAmount.toFixed(),
        tentativeWinning: !!payout.tentativeWinning,
      },
    );
  });
  const disputeRound = totalCompletedStakeOnAllPayouts.equals(0) ? null : stakeRows.disputeRound[0] == null ? 0 : stakeRows.disputeRound[0].disputeRound;
  return {
    marketId: marketRow.marketId,
    stakes: stakeResults,
    disputeRound,
  };
}

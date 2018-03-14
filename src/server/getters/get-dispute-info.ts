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
  stakesCompleted: Array<StakeRow>;
  stakesCurrent: Array<ActiveCrowdsourcer>;
  accountStakesCompleted: Array<StakeRow>;
  accountStakesCurrent: Array<StakeRow>;
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
  stakeCurrent?: string;
  stakeRemaining?: string;
  accountStakeCompleted?: string;
  accountStakeCurrent?: string;
}

const activeMarketStates = ["CROWDSOURCING_DISPUTE", "AWAITING_NEXT_WINDOW", "FORKING", "AWAITING_FORK_MIGRATION"];

function isActiveMarketState(reportingState: ReportingState|null|undefined) {
  if (reportingState == null) return null;
  return activeMarketStates.indexOf(reportingState) !== -1;
}

function calculateBondSize(totalCompletedStakeOnAllPayouts: BigNumber, completedStakeAmount: BigNumber): BigNumber {
  return new BigNumber(totalCompletedStakeOnAllPayouts.times(2).toString())
    .minus(
      new BigNumber(completedStakeAmount).times(3).toString());
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
    stakesCompleted: (next: AsyncCallback) => completedStake.asCallback(next),
    stakesCurrent: (next: AsyncCallback) => db("crowdsourcers").select(["marketId", "payoutId"]).sum("amountStaked as amountStaked").sum("size as size").groupBy(["crowdsourcers.marketId", "payoutId"]).whereNull("completed").whereIn("crowdsourcers.marketId", marketIds).asCallback(next),
    accountStakesCurrent: (next: AsyncCallback) => accountStake.clone().whereNull("crowdsourcers.completed").asCallback(next),
    accountStakesCompleted: (next: AsyncCallback) => accountStake.clone().where("crowdsourcers.completed", 1).asCallback(next),
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
    _.sum(_.map(stakeRows.stakesCompleted, (completedStake) => completedStake.amountStaked)).toString());

  const stakeCompletedByPayout: { [payoutId: number]: StakeRow } = _.keyBy(stakeRows.stakesCompleted, "payoutId");
  const stakeCurrentByPayout: { [payoutId: number]: ActiveCrowdsourcer } = _.keyBy(stakeRows.stakesCurrent, "payoutId");
  const accountStakeCompletedByPayout: { [payoutId: number]: StakeRow } = _.keyBy(stakeRows.accountStakesCompleted, "payoutId");
  const accountStakeCurrentByPayout: { [payoutId: number]: StakeRow } = _.keyBy(stakeRows.accountStakesCurrent, "payoutId");

  const stakeResults = _.map(stakeRows.payouts, (payout: PayoutRow) => {
    const stakeCompletedRow = stakeCompletedByPayout[payout.payoutId];
    const stakeCurrentRow = stakeCurrentByPayout[payout.payoutId];
    const accountStakeCompletedRow = accountStakeCompletedByPayout[payout.payoutId];
    const accountStakeCurrentRow = accountStakeCurrentByPayout[payout.payoutId];

    const stakeCompletedAmount = new BigNumber(stakeCompletedRow == null ? 0 : stakeCompletedRow.amountStaked.toString());
    const stakeCurrentOnPayout = new BigNumber(stakeCurrentRow == null ? 0 : stakeCurrentRow.amountStaked.toString());

    let currentAmounts: StakeSizes;
    if (payout.tentativeWinning === 1 || !isActiveMarketState(marketRow.reportingState)) {
      currentAmounts = {};
    } else {
      let size: BigNumber;
      let stakeCurrent: BigNumber;
      let accountStakeCurrent: BigNumber;
      if (stakeCurrentRow == null) {
          size = calculateBondSize(totalCompletedStakeOnAllPayouts, stakeCompletedAmount);
          stakeCurrent = ZERO;
          accountStakeCurrent = ZERO;
      } else {
          size = new BigNumber(stakeCurrentRow.size.toString());
          stakeCurrent = new BigNumber(stakeCurrentRow.amountStaked.toString());
          accountStakeCurrent = new BigNumber(accountStakeCurrentRow === undefined ? 0 : accountStakeCurrentRow.amountStaked.toString());
      }
      currentAmounts = {
        size: size.toFixed(),
        stakeCurrent: stakeCurrent.toFixed(),
        accountStakeCurrent: accountStakeCurrent.toFixed(),
        stakeRemaining: size.minus(stakeCurrent).toFixed(),
      };
    }

    currentAmounts.accountStakeCompleted = new BigNumber(accountStakeCompletedRow === undefined ? 0 : accountStakeCompletedRow.amountStaked.toString()).toFixed();
    return Object.assign({},
      normalizePayouts(payout),
      currentAmounts,
      {
        stakeCurrent: stakeCurrentOnPayout.toFixed(),
        stakeCompleted: stakeCompletedAmount.toFixed(),
        tentativeWinning: !!payout.tentativeWinning,
      },
    );
  });
  const disputeRound = totalCompletedStakeOnAllPayouts.equals(0) ? null : stakeRows.disputeRound[0] == null ? 0 : stakeRows.disputeRound[0].disputeRound;
  return {
    marketId: marketRow.marketId,
    stakeCompletedTotal: totalCompletedStakeOnAllPayouts.toFixed(),
    sizeOfNewStake: totalCompletedStakeOnAllPayouts.times(2).toFixed(),
    stakes: stakeResults,
    disputeRound,
  };
}

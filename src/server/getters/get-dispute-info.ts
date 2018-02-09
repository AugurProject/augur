import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { Address, MarketsRowWithCreationTime, OutcomesRow, AsyncCallback, Payout, UIStakeInfo, PayoutRow } from "../../types";
import { getMarketsWithReportingState, normalizePayouts } from "./database";
import { BigNumber } from "bignumber.js";
import { QueryBuilder } from "knex";

interface DisputeRound {
  marketID: Address;
  disputeRound: number;
}

interface DisputesResult {
  markets: Array<MarketsRowWithCreationTime>;
  disputes: Array<OutcomesRow>;
  completedStakes: Array<StakeRow>;
  activeCrowdsourcer: Array<ActiveCrowdsourcer>;
  payouts: Array<PayoutRow>;
  disputeRound: Array<DisputeRound>;
}

interface StakeRow extends Payout {
  marketID: Address;
  amountStaked: number;
  payoutID: number;
}

interface ActiveCrowdsourcer extends StakeRow {
  size: number;
}
function calculateBondSize(totalCompletedStakeOnAllPayouts: BigNumber, completedStakeAmount: BigNumber): BigNumber {
  return new BigNumber(totalCompletedStakeOnAllPayouts.times(2))
    .minus(
      new BigNumber(completedStakeAmount).times(3));
}

export function getDisputeInfo(db: Knex, marketIDs: Array<Address>, callback: (err: Error|null, result?: Array<UIStakeInfo|null>) => void): void {
  if (marketIDs == null) return callback(new Error("must include marketIDs parameter"));
  const completedStake = db.select(["marketID", "payoutID", "amountStaked"]).from((builder: QueryBuilder) =>
    builder.from("crowdsourcers").select("marketID", "payoutID", "amountStaked").where("completed", 1).whereIn("marketID", marketIDs).union((builder: QueryBuilder) =>
      builder.select(["marketID", "payoutID", "amountStaked"]).from("initial_reports").whereIn("marketID", marketIDs),
    )).groupBy("marketID", "payoutID");

  parallel({
    markets: (next: AsyncCallback) => getMarketsWithReportingState(db).whereIn("markets.marketID", marketIDs).asCallback(next),
    payouts: (next: AsyncCallback) => db("payouts").whereIn("marketID", marketIDs).asCallback(next),
    completedStakes: (next: AsyncCallback) => completedStake.asCallback(next),
    activeCrowdsourcer: (next: AsyncCallback) => db("crowdsourcers").select(["marketID", "payoutID"]).sum("amountStaked as amountStaked").sum("size as size").groupBy(["crowdsourcers.marketID", "payoutID"]).whereNull("completed").whereIn("crowdsourcers.marketID", marketIDs).asCallback(next),
    disputeRound: (next: AsyncCallback) => db("crowdsourcers").select("marketID").count("* as disputeRound").groupBy("crowdsourcers.marketID").where("crowdsourcers.completed", 1).whereIn("crowdsourcers.marketID", marketIDs).asCallback(next),
  }, (err: Error|null, stakeResults: DisputesResult): void => {
    if (err) return callback(err);
    if (!stakeResults.markets) return callback(new Error("Could not retrieve markets"));

    const marketDisputeDetails: Array<DisputesResult> =
      _.map(marketIDs, (marketID: Address) =>
        _.mapValues(stakeResults, (result) => _.filter(result, { marketID })),
      );
    callback(null, _.map(marketDisputeDetails, reshapeStakeRowToUIStakeInfo));
  });
}

function reshapeStakeRowToUIStakeInfo(stakeRows: DisputesResult): UIStakeInfo|null {
  if (stakeRows.markets.length === 0) {
    return null;
  }
  const totalCompletedStakeOnAllPayouts = new BigNumber(
    _.sum(_.map(stakeRows.completedStakes, (completedStake) => completedStake.amountStaked)));

  const completedStakeByPayout: { [payoutID: number]: StakeRow } = _.keyBy(stakeRows.completedStakes, "payoutID");
  const activeCrowdsourcerByPayout: { [payoutID: number]: ActiveCrowdsourcer } = _.keyBy(stakeRows.activeCrowdsourcer, "payoutID");

  const stakeResults = _.map(stakeRows.payouts, (payout: PayoutRow) => {
    const completedStakes = completedStakeByPayout[payout.payoutID];
    const activeCrowdsourcer = activeCrowdsourcerByPayout[payout.payoutID];

    const completedStakeAmount = new BigNumber(completedStakes == null ? 0 : completedStakes.amountStaked);
    const totalStakeOnPayout = completedStakeAmount.add(new BigNumber(activeCrowdsourcer == null ? 0 : activeCrowdsourcer.amountStaked));

    let currentAmounts: {size?: string; currentStake?: string};
    // let size: BigNumber;
    // let amountStaked: BigNumber;
    if (payout.tentativeWinning === 1) {
      currentAmounts = {};
    } else if (activeCrowdsourcer == null) {
      currentAmounts = {
        size: calculateBondSize(totalCompletedStakeOnAllPayouts, completedStakeAmount).toFixed(),
        currentStake: new BigNumber(0).toFixed(),
      };
    } else {
      currentAmounts = {
        size: new BigNumber(activeCrowdsourcer.size).toFixed(),
        currentStake: new BigNumber(activeCrowdsourcer.amountStaked).toFixed(),
      };
    }
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
    marketID: stakeRows.markets[0].marketID,
    stakes: stakeResults,
    disputeRound,
  };
}

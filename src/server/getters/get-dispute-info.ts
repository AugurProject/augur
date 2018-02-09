import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { Address, MarketsRowWithCreationTime, OutcomesRow, AsyncCallback, Payout, UIStakeInfo, PayoutRow } from "../../types";
import { getMarketsWithReportingState, normalizePayouts } from "./database";
import { BigNumber } from "bignumber.js";

interface DisputesResult {
  markets: Array<MarketsRowWithCreationTime>;
  disputes: Array<OutcomesRow>;
  crowdsourcerTotals: Array<StakeRow>;
  initialReport: Array<StakeRow>;
  payouts: any;
  disputeRound: any;
}

interface StakeRow extends Payout {
  marketID: Address;
  amountStaked: number;
  payoutID: number;
  size?: number;
  completed: number|null;
}

export function getDisputeInfo(db: Knex, marketIDs: Array<Address>, callback: (err: Error|null, result?: Array<UIStakeInfo|null>) => void): void {
  if (marketIDs == null) return callback(new Error("must include marketIDs parameter"));

  // TODO: add disputes by reporter
  parallel({
    markets: (next: AsyncCallback) => getMarketsWithReportingState(db).whereIn("markets.marketID", marketIDs).asCallback(next),
    payouts: (next: AsyncCallback) => db("payouts").whereIn("marketID", marketIDs).asCallback(next),
    crowdsourcerTotals: (next: AsyncCallback) => db("crowdsourcers").select(["marketID", "payoutID", "completed"]).sum("amountStaked as amountStaked").sum("size as size").groupBy(["crowdsourcers.marketID", "payoutID", "completed"]).whereNot("completed", 0).whereIn("crowdsourcers.marketID", marketIDs).asCallback(next),
    disputeRound: (next: AsyncCallback) => db("crowdsourcers").select("marketID").count("* as disputeRound").groupBy("crowdsourcers.marketID").where("crowdsourcers.completed", 1).whereIn("crowdsourcers.marketID", marketIDs).asCallback(next),
    initialReport: (next: AsyncCallback) => db("initial_reports").select("*").whereIn("initial_reports.marketID", marketIDs).asCallback(next),
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
    _.sum(
      _.map(
        stakeRows.crowdsourcerTotals, (crowdsourcerTotal) =>
          crowdsourcerTotal.completed === 1 ? crowdsourcerTotal.amountStaked : 0,
      ),
    ),
  );

  const crowdsourcerByPayout: { [payoutID: number]: Array<StakeRow> } = _.groupBy(stakeRows.crowdsourcerTotals, "payoutID");

  const stakeResults = _.map(stakeRows.payouts, (payout: PayoutRow) => {
    const completedCrowdsourcerTotals = _.find(stakeRows.crowdsourcerTotals, (crowdsourcerTotal) =>
      crowdsourcerTotal.completed === 1 && crowdsourcerTotal.payoutID === payout.payoutID);
    const activeCrowdsourcer = _.find(stakeRows.crowdsourcerTotals, (crowdsourcerTotal) =>
      crowdsourcerTotal.completed === null && crowdsourcerTotal.payoutID === payout.payoutID);
    const initialReport = _.find(stakeRows.initialReport, (initialReport) =>
      initialReport.payoutID === payout.payoutID);

    const totalCompletedStakedOnPayout = new BigNumber(completedCrowdsourcerTotals == null ? 0 : completedCrowdsourcerTotals.amountStaked)
      .add(new BigNumber(initialReport == null ? 0 : initialReport.amountStaked));
    const totalActiveStakedOnPayout = new BigNumber(activeCrowdsourcer == null ? 0 : activeCrowdsourcer.amountStaked);

    let size: BigNumber;
    let amountStaked: BigNumber;
    if (payout.tentativeWinning === 1) {
      size = new BigNumber(0);
      amountStaked = new BigNumber(0);
    } else if (activeCrowdsourcer == null) {
      size = totalCompletedStakeOnAllPayouts.times(2).minus(totalCompletedStakedOnPayout).times(3);
      amountStaked = new BigNumber(0);
    } else {
      size = new BigNumber(activeCrowdsourcer.size || 0);
      amountStaked = new BigNumber(activeCrowdsourcer.amountStaked);
    }
    return Object.assign({},
      normalizePayouts(payout),
      {
        totalStaked: totalCompletedStakedOnPayout.plus(totalActiveStakedOnPayout).toFixed(),
        size: size.toFixed(),
        amountStaked: amountStaked.toFixed(),
        initialReport: initialReport != null,
        tentativeWinning: !!payout.tentativeWinning,
      },
    );
  });
  const disputeRound = stakeRows.initialReport == null ? null : stakeRows.disputeRound[0] == null ? 0 : stakeRows.disputeRound[0].disputeRound;
  return {
    marketID: stakeRows.markets[0].marketID,
    stakes: stakeResults,
    disputeRound,
  };
}

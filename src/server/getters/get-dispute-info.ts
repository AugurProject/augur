import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { Address, MarketsRowWithCreationTime, OutcomesRow, AsyncCallback, Payout, UIStakeInfo } from "../../types";
import { getMarketsWithReportingState, normalizePayouts } from "./database";

interface DisputesResult {
  markets: Array<MarketsRowWithCreationTime>;
  disputes: Array<OutcomesRow>;
  crowdsourcers: Array<StakeRow>;
  initialReport: Array<StakeRow>;
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
    // disputes: (next: AsyncCallback) => db("disputes").select("*").join("crowdsourcers", "crowdsourcers.crowdsourcerID", "disputes.crowdsourcerID").whereIn("marketID", marketIDs).asCallback(next),
    crowdsourcers: (next: AsyncCallback) => db("crowdsourcers").select("*").join("payouts", "payouts.payoutID", "crowdsourcers.payoutID").whereIn("crowdsourcers.marketID", marketIDs).asCallback(next),
    initialReport: (next: AsyncCallback) => db("initial_reports").select("*").join("payouts", "payouts.payoutID", "initial_reports.payoutID").whereIn("initial_reports.marketID", marketIDs).asCallback(next),
  }, (err: Error|null, stakeResults: DisputesResult): void => {
    if (err) return callback(err);
    if (!stakeResults.markets) return callback(new Error("Could not retrieve markets"));

    const marketDisputeDetails: Array<DisputesResult> =
      _.map(marketIDs, (marketID: Address) =>
        _.mapValues(stakeResults, (result) => _.filter(result, {marketID})),
      );
    callback(null, _.map(marketDisputeDetails, reshapeStakeRowToUIStakeInfo));
  });
}

function reshapeStakeRowToUIStakeInfo(stakeRows: DisputesResult): UIStakeInfo|null {
  if (stakeRows.markets.length === 0) {
    return null;
  }
  const payoutGrouped: { [payoutID: number]: Array<StakeRow>} = _.groupBy(stakeRows.crowdsourcers.concat(stakeRows.initialReport), "payoutID");
  const stakeResults = _.map(payoutGrouped, (stakes: Array<StakeRow>) => {
    const totalStaked = _.sumBy(stakes, (stake: StakeRow) => {
      return stake.amountStaked;
    });
    const activeCrowdsourcer = _.find(stakes, (stake: StakeRow) => stake.completed === null);
    let size: number;
    let amountStaked: number;
    if (activeCrowdsourcer == null) {
      // TODO: calculate from existing stakes if no crowdsourcer created yet
      size = 0;
      amountStaked = 0;
    } else {
      size = activeCrowdsourcer.size!;
      amountStaked = activeCrowdsourcer.amountStaked;
    }
    return Object.assign({},
      normalizePayouts(stakes[0]),
      {
        totalStaked,
        size,
        amountStaked,
      },
    );
  });
  return {
    marketID: stakeRows.markets[0].marketID,
    stakes: stakeResults,
  };
}

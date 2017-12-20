import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { Address, MarketsRowWithCreationTime, UIMarketCreatorFees, ErrorCallback, AsyncCallback, ReportingState} from "../../types";
import { reshapeOutcomesRowToUIOutcomeInfo, reshapeMarketsRowToUIMarketInfo, getMarketsWithReportingState } from "./database";

interface MarketCreatorFeesRow {
  marketID: Address;
  reportingState: ReportingState;
  marketCreatorFeesCollected: number;
  marketCreatorFeesClaimed: number;
}

export function getUnclaimedMarketCreatorFees(db: Knex, marketIDs: Array<Address>, callback: (err: Error|null, result?: UIMarketCreatorFees) => void): void {
  if (marketIDs == null) return callback(new Error("must include marketIDs parameter"));
  let marketsQuery: Knex.QueryBuilder = getMarketsWithReportingState(db, ["markets.marketID", "market_state.reportingState", "markets.marketCreatorFeesCollected", "markets.marketCreatorFeesClaimed"]);
  marketsQuery = marketsQuery.whereIn("markets.marketID", marketIDs);
  marketsQuery.asCallback(( err: Error|null, marketCreatorFeeRows: Array<MarketCreatorFeesRow>): void => {
    if (err != null) return callback(err);
    callback(null,
      marketCreatorFeeRows.reduce( (acc: UIMarketCreatorFees, row) => {
        acc[row.marketID] = row.reportingState === ReportingState.FINALIZED ? row.marketCreatorFeesCollected - row.marketCreatorFeesClaimed : 0;
        return acc;
      },
      {}),
    );
  });
}

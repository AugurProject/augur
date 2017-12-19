import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { Address, MarketsRowWithCreationTime, OutcomesRow, UIMarketInfo, UIMarketsInfo, UIOutcomeInfo, ErrorCallback, AsyncCallback} from "../../types";
import { reshapeOutcomesRowToUIOutcomeInfo, reshapeMarketsRowToUIMarketInfo, getMarketsWithReportingState } from "./database";

interface MarketOutcomeResult {
  marketsRows: Array<MarketsRowWithCreationTime>;
  outcomesRows: Array<OutcomesRow>;
}

export function getUnclaimedMarketCreatorFees(db: Knex, marketIDs: Array<Address>, callback: (err: Error|null, result?: any) => void): void {
  if (marketIDs == null) return callback(new Error("must include marketIDs parameter"));
  let marketsQuery: Knex.QueryBuilder = getMarketsWithReportingState(db, ["markets.marketID", "markets.marketCreatorFeesCollected", "markets.marketCreatorFeesClaimed"]);
  marketsQuery.where("market_state.reportingState", "DESIGNATED_REPORTING");
  marketsQuery = marketsQuery.whereIn("markets.marketID", marketIDs);
  console.log(marketsQuery.toSQL());
  marketsQuery.asCallback(( err: Error|null, marketCreatorFeeRows: Array<any>): void => {
    console.log(err, marketCreatorFeeRows);
    if (err != null) return callback(err);
    callback(null,
      marketCreatorFeeRows.reduce( (acc, row) => {
        acc[row.marketID] = row.marketCreatorFeesCollected - row.marketCreatorFeesClaimed;
        return acc;
      },
      {}),
    );
  });
}

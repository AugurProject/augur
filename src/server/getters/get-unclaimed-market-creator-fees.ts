import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { Address, MarketsRowWithCreationTime, UIMarketCreatorFee, ErrorCallback, AsyncCallback, ReportingState} from "../../types";
import { reshapeOutcomesRowToUIOutcomeInfo, reshapeMarketsRowToUIMarketInfo, getMarketsWithReportingState } from "./database";

interface MarketCreatorFeesRow {
  marketID: Address;
  reportingState: ReportingState;
  marketCreatorFeesCollected: number;
  marketCreatorFeesClaimed: number;
}

export function getUnclaimedMarketCreatorFees(db: Knex, marketIDs: Array<Address>, callback: (err: Error|null, result?: Array<UIMarketCreatorFee>) => void): void {
  if (marketIDs == null) return callback(new Error("must include marketIDs parameter"));
  let marketsQuery: Knex.QueryBuilder = getMarketsWithReportingState(db, ["markets.marketID", "market_state.reportingState", "markets.marketCreatorFeesCollected", "markets.marketCreatorFeesClaimed"]);
  marketsQuery = marketsQuery.whereIn("markets.marketID", marketIDs);
  marketsQuery.asCallback(( err: Error|null, marketCreatorFeeRows: Array<MarketCreatorFeesRow>): void => {
    if (err != null) return callback(err);
    const feeRowsByMarket = _.keyBy(marketCreatorFeeRows, (r: MarketCreatorFeesRow): string => r.marketID);
    const feeResult: Array<UIMarketCreatorFee> = _.map( marketIDs, (marketID: string): any|null => {
      const market = feeRowsByMarket[marketID];
      if ( !market ) {
        return null;
      } else {
        return {
          marketID,
          unclaimedFee: market.reportingState === ReportingState.FINALIZED ? market.marketCreatorFeesCollected - market.marketCreatorFeesClaimed : 0,
        };
      }
    });
    callback(null,
      feeResult);
  });
}

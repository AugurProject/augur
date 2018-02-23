import * as Knex from "knex";
import * as _ from "lodash";
import { Address, UIMarketCreatorFee, ReportingState} from "../../types";
import { getMarketsWithReportingState } from "./database";

interface MarketCreatorFeesRow {
  marketId: Address;
  reportingState: ReportingState;
  marketCreatorFeesCollected: number;
  marketCreatorFeesClaimed: number;
}

export function getUnclaimedMarketCreatorFees(db: Knex, marketIds: Array<Address>, callback: (err: Error|null, result?: Array<UIMarketCreatorFee>) => void): void {
  if (marketIds == null) return callback(new Error("must include marketIds parameter"));
  let marketsQuery: Knex.QueryBuilder = getMarketsWithReportingState(db, ["markets.marketId", "market_state.reportingState", "markets.marketCreatorFeesCollected", "markets.marketCreatorFeesClaimed"]);
  marketsQuery = marketsQuery.whereIn("markets.marketId", marketIds);
  marketsQuery.asCallback(( err: Error|null, marketCreatorFeeRows: Array<MarketCreatorFeesRow>): void => {
    if (err != null) return callback(err);
    const feeRowsByMarket = _.keyBy(marketCreatorFeeRows, (r: MarketCreatorFeesRow): string => r.marketId);
    const feeResult: Array<UIMarketCreatorFee> = _.map( marketIds, (marketId: string): any|null => {
      const market = feeRowsByMarket[marketId];
      if ( !market ) {
        return null;
      } else {
        return {
          marketId,
          unclaimedFee: market.reportingState === ReportingState.FINALIZED ? market.marketCreatorFeesCollected - market.marketCreatorFeesClaimed : 0,
        };
      }
    });
    callback(null, feeResult);
  });
}

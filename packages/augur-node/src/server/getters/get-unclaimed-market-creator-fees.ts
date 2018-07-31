import * as Knex from "knex";
import * as _ from "lodash";
import { Address, UIMarketCreatorFee, ReportingState} from "../../types";
import { getMarketsWithReportingState } from "./database";
import Augur from "augur.js";
import { ZERO } from "../../constants";

interface MarketCreatorFeesRow {
  marketId: Address;
  reportingState: ReportingState;
  marketCreatorFeesBalance: BigNumber;
  balance: BigNumber;
}

export function getUnclaimedMarketCreatorFees(db: Knex, augur: Augur, marketIds: Array<Address>, callback: (err: Error|null, result?: Array<UIMarketCreatorFee>) => void): void {
  if (marketIds == null) return callback(new Error("must include marketIds parameter"));
  let marketsQuery: Knex.QueryBuilder = getMarketsWithReportingState(db, ["markets.marketId", "market_state.reportingState", "markets.marketCreatorFeesBalance", "cash.balance"]);
  marketsQuery = marketsQuery.whereIn("markets.marketId", marketIds);
  marketsQuery.leftJoin("balances AS cash", function () {
    this
      .on("cash.owner", db.raw("markets.marketCreatorMailbox"))
      .andOn("cash.token", db.raw("?", augur.contracts.addresses[augur.rpc.getNetworkID()].Cash));
  });

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
          unclaimedFee: market.marketCreatorFeesBalance.plus(market.balance || ZERO).toFixed(),
        };
      }
    });
    callback(null, feeResult);
  });
}

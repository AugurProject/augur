import * as Knex from "knex";
import * as _ from "lodash";
import { Address, UIMarketCreatorFee, ReportingState } from "../../types";
import { getCashAddress, getMarketsWithReportingState } from "./database";
import Augur from "augur.js";
import { ZERO } from "../../constants";
import * as t from "io-ts";

export const UnclaimedMarketCreatorFeesParams = t.type({
  marketIds: t.array(t.string),
});

interface MarketCreatorFeesRow {
  marketId: Address;
  reportingState: ReportingState;
  marketCreatorFeesBalance: BigNumber;
  balance: BigNumber;
}

export async function getUnclaimedMarketCreatorFees(db: Knex, augur: Augur, params: t.TypeOf<typeof UnclaimedMarketCreatorFeesParams>): Promise<Array<UIMarketCreatorFee>> {
  const marketsQuery: Knex.QueryBuilder = getMarketsWithReportingState(db, ["markets.marketId", "market_state.reportingState", "markets.marketCreatorFeesBalance", "cash.balance"]);
  marketsQuery.whereIn("markets.marketId", params.marketIds);
  marketsQuery.leftJoin("balances AS cash", function () {
    this
      .on("cash.owner", db.raw("markets.marketCreatorMailbox"))
      .andOn("cash.token", db.raw("?", getCashAddress(augur)));
  });

  const marketCreatorFeeRows: Array<MarketCreatorFeesRow> = await marketsQuery;
  const feeRowsByMarket = _.keyBy(marketCreatorFeeRows, (r: MarketCreatorFeesRow): string => r.marketId);
  const feeResult: Array<UIMarketCreatorFee> = _.map(params.marketIds, (marketId: string): any|null => {
    const market = feeRowsByMarket[marketId];
    if (!market) {
      return null;
    } else {
      return {
        marketId,
        unclaimedFee: market.marketCreatorFeesBalance.plus(market.balance || ZERO).toString(),
      };
    }
  });
  return feeResult;
}

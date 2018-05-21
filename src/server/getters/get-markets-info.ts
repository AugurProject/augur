import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import { Address, MarketsRowWithTime, OutcomesRow, UIMarketInfo, UIMarketsInfo, UIOutcomeInfo, AsyncCallback, PayoutRow, MarketsContractAddressRow } from "../../types";
import { reshapeOutcomesRowToUIOutcomeInfo, reshapeMarketsRowToUIMarketInfo, getMarketsWithReportingState } from "./database";

interface MarketOutcomeResult {
  marketsRows: Array<MarketsRowWithTime>;
  outcomesRows: Array<OutcomesRow<BigNumber>>;
  winningPayoutRows: Array<PayoutRow<BigNumber> & MarketsContractAddressRow>;
}

export function getMarketsInfo(db: Knex, marketIds: Array<Address>, callback: (err: Error|null, result?: UIMarketsInfo<string>) => void): void {
  const marketsQuery: Knex.QueryBuilder = getMarketsWithReportingState(db);
  if (marketIds == null || ! _.isArray(marketIds) ) return callback(new Error("must include marketIds parameter"));
  const cleanedMarketIds = _.compact(marketIds);
  marketsQuery.whereIn("markets.marketId", cleanedMarketIds);
  marketsQuery.leftJoin("blocks as finalizationBlockNumber", "finalizationBlockNumber.blockNumber", "markets.finalizationBlockNumber").select("finalizationBlockNumber.timestamp as finalizationTime");

  parallel({
    marketsRows: (next: AsyncCallback) => marketsQuery.asCallback(next),
    outcomesRows: (next: AsyncCallback) => db("outcomes").whereIn("marketId", cleanedMarketIds).asCallback(next),
    winningPayoutRows: (next: AsyncCallback) => db("payouts").whereIn("marketId", cleanedMarketIds).where("winning", 1).asCallback(next),
  }, (err: Error|null, marketOutcomeResult: MarketOutcomeResult ): void => {
    if (err) return callback(err);
    const { marketsRows, outcomesRows, winningPayoutRows } = marketOutcomeResult;
    if (!marketsRows) return callback(null);
    const marketsRowsByMarket = _.keyBy(marketsRows, (r: MarketsRowWithTime): string => r.marketId);
    const outcomesRowsByMarket = _.groupBy(outcomesRows, (r: OutcomesRow<BigNumber>): string => r.marketId);
    const winningPayoutByMarket = _.keyBy(winningPayoutRows, (r: PayoutRow<BigNumber> & MarketsContractAddressRow): string => r.marketId);
    const marketsInfo: UIMarketsInfo<string> = _.map(marketIds, (marketId: string): UIMarketInfo<string>|null => {
      const market = marketsRowsByMarket[marketId];
      if ( !market ) {
        return null;
      }
      const outcomes = _.map(outcomesRowsByMarket[marketId], (outcomesRow: OutcomesRow<BigNumber>): UIOutcomeInfo<BigNumber> => reshapeOutcomesRowToUIOutcomeInfo(outcomesRow));
      return reshapeMarketsRowToUIMarketInfo(market, outcomes, winningPayoutByMarket[marketId]);
    });

    callback(null, marketsInfo);
  });
}

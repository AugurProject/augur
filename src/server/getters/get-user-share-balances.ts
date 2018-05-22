import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address } from "../../types";
import { getMarketsWithReportingState } from "./database";

interface ShareTokenBalances {
  marketId: Address;
  balance: BigNumber;
  owner: Address;
  outcome: number;
};


interface MarketBalances {
  [market: string]: Array<string>
};

export function getUserShareBalances(db: Knex, augur: Augur, marketIds: Array<Address>, account: Address, callback: (err: Error|null, result?: Array<ShareTokenBalances>) => void): void {
  if (marketIds == null) return callback(new Error("must include marketIds parameter"));
  if (account == null) return callback(new Error("must include account parameter"));

  // NB: we don't really need market state here, but this is a convenient
  // helper non-the-less considering simplifing.
  const marketsQuery: Knex.QueryBuilder = getMarketsWithReportingState(db, ["markets.marketId", "balances.balance", "balances.owner", "shareTokens.outcome"]);
  marketsQuery.whereIn("markets.marketId", marketIds);
  marketsQuery.join("tokens AS shareTokens", function () {
    this
      .on("shareTokens.marketId", "markets.marketId")
      .andOn("symbol", db.raw("?", "shares"));
  });
  marketsQuery.join("balances", function () {
    this
      .on("balances.token", "shareTokens.contractAddress")
      .andOn("balances.owner", db.raw("?", account));
  });
  marketsQuery.orderBy("markets.marketId");
  marketsQuery.orderBy("shareTokens.outcome");
  marketsQuery.asCallback(( err: Error|null, balances: Array<ShareTokenBalances>): void => {
    if (err != null) return callback(err);

    const balancesByMarket = _.chain(balances)
      .groupBy((row) => row.marketId)
      .mapValues((groupedBalances: Array<ShareTokenBalances>) => groupedBalances.map((row) => row.balance))
      .value();

    console.log(balancesByMarket);

    callback(null, balancesByMarket);
  });
}

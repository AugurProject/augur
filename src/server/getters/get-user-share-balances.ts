import BigNumber from "bignumber.js";
import * as Knex from "knex";
import * as _ from "lodash";
import Augur from "augur.js";
import { Address } from "../../types";
import { numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";

interface ShareTokenBalances {
  marketId: Address;
  minPrice: BigNumber;
  maxPrice: BigNumber;
  numTicks: BigNumber;
  owner: Address;
  outcome: number;
  balance: BigNumber | null;
}

export interface MarketBalances {
  [market: string]: Array<string>;
}

export function getUserShareBalances(db: Knex, augur: Augur, marketIds: Array<Address>, account: Address, callback: (err: Error|null, result?: MarketBalances) => void): void {
  if (marketIds == null) return callback(new Error("must include marketIds parameter"));
  if (account == null) return callback(new Error("must include account parameter"));

  // NB: we don't really need market state here, but this is a convenient
  // helper non-the-less considering simplifing.
  const query = db("tokens")
    .select("tokens.marketId", "tokens.outcome", "balances.balance", "markets.minPrice", "markets.maxPrice", "markets.numTicks")
    .join("markets", function() {
      this
        .on("markets.marketId", "tokens.marketId")
        .andOn("tokens.symbol", db.raw("?", "shares"));
    })
    .leftJoin("balances", function () {
      this
        .on("balances.token", "tokens.contractAddress")
        .andOn("balances.owner", db.raw("?", account));
    })
    .orderBy("tokens.marketId")
    .orderBy("tokens.outcome")
    .whereIn("tokens.marketId", marketIds);

  query.asCallback(( err: Error|null, balances: Array<ShareTokenBalances>): void => {
    if (err != null) return callback(err);

    const balancesByMarket = _.chain(balances)
      .groupBy((row) => row.marketId)
      .mapValues((groupedBalances: Array<ShareTokenBalances>) => {
        return groupedBalances.map((row) => {
          if (row.balance === null) return "0";

          const tickSize = numTicksToTickSize(row.numTicks, row.minPrice, row.maxPrice);
          return augur.utils.convertOnChainAmountToDisplayAmount(row.balance, tickSize).toFixed();
        });
      })
      .value();

    callback(null, balancesByMarket);
  });
}

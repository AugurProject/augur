import Augur from "augur.js";
import * as Knex from "knex";
import * as _ from "lodash";
import { numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";
import { Address } from "../../types";
import { getOutcomesProfitLoss, EarningsAtTime, ProfitLoss, formatProfitLossResults } from "./get-profit-loss";

async function queryUniverse(db: Knex, marketId: Address): Promise<Address> {
  const market = await db.first("universe").from("markets").where({ marketId });
  if (!market || market.universe == null) throw new Error("If universe isn't provided, you must provide a valid marketId");
  return market.universe;
}

async function queryUserTradingPositions(db: Knex, augur: Augur, universe: Address|null, account: Address, marketId: Address|null|undefined, outcome: number|null|undefined, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined): Promise<any> {
  if (universe == null && marketId == null) throw new Error("Must provide reference to universe, specify universe or marketId");
  if (account == null) throw new Error("Missing required parameter: account");

  const universeId = universe || await queryUniverse(db, marketId as string);
  const results = await getOutcomesProfitLoss(db, augur, Date.now(), universeId as Address, account as Address, marketId || null, null, null, null);

  if (results === null) return [];

  const { all: earningsPerMarket } = await formatProfitLossResults(db, results);

  const allTimeEarningsPerMarket = _.mapValues(earningsPerMarket, (outcomes: Array<Array<EarningsAtTime>>, marketId: Address) => {
    return outcomes.map((earnings: Array<EarningsAtTime>) => earnings === null ? null : earnings[earnings.length - 1].profitLoss);
  });

  const marketBalances = await db.select("marketId", "outcome", "balance").from("balances_detail").whereIn("marketId", _.keys(allTimeEarningsPerMarket)).where({ owner: account });
  const marketDetails = await db.select("marketId", "numTicks", "maxPrice", "minPrice").from("markets").whereIn("marketId", _.keys(allTimeEarningsPerMarket));

  const balancesByMarketOutcome = _.keyBy(marketBalances, (balance) => `${balance.marketId}_${balance.outcome}`);
  const detailsByMarket = _.keyBy(marketDetails, "marketId");

  const positionsRows = _.flatMap(allTimeEarningsPerMarket, (earnings: Array<ProfitLoss|null>, marketId: Address) => {
    const byOutcomes = earnings.map((profitLossResult: ProfitLoss|null, outcome: number) => {
      const profitLoss = profitLossResult || { realized: "0", unrealized: "0", meanOpenPrice: "0", position: "0" };

      const marketDetailsRow  = detailsByMarket[marketId];
      if (!marketDetailsRow) throw new Error(`Data integrity error: Market ${marketId} not found while processing getUserTradingPositions`);

      let numShares = "0";
      const marketBalancesRow = balancesByMarketOutcome[`${marketId}_${outcome}`];
      if (marketBalancesRow) {
        const tickSize = numTicksToTickSize(marketDetailsRow.numTicks, marketDetailsRow.minPrice, marketDetailsRow.maxPrice);
        numShares = augur.utils.convertOnChainAmountToDisplayAmount(marketBalancesRow.balance, tickSize).toString();
      }

      return {
        marketId,
        outcome,
        numShares,
        realizedProfitLoss: profitLoss.realized,
        unrealizedProfitLoss: profitLoss.unrealized,
        numSharesAdjustedForUserIntention: profitLoss.position,
        averagePrice: profitLoss.meanOpenPrice,
      };
    });

    if (typeof outcome === "number" && byOutcomes[outcome]) return [byOutcomes[outcome]];
    return byOutcomes;
  });

  return positionsRows;
}

// Look up a user's current trading positions. Should take account (address) as a required parameter and market and outcome as optional parameters. Response should include the user's position after the trade, in both "raw" and "adjusted" formats -- the latter meaning that short positions are shown as negative for yesNo and scalar markets, and realized and unrealized profit/loss.
export function getUserTradingPositions(db: Knex, augur: Augur, universe: Address|null, account: Address, marketId: Address|null|undefined, outcome: number|null|undefined, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  queryUserTradingPositions(db, augur, universe, account, marketId, outcome, sortBy, isSortDescending, limit, offset).then((result) => { callback(null, result); }).catch((err) => callback(err));
}

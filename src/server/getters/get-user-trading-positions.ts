import Augur from "augur.js";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import * as _ from "lodash";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { Address, PositionsRow } from "../../types";
import { queryModifier } from "./database";
import { getOutcomesProfitLoss, MarketOutcomeEarnings, EarningsAtTime, ProfitLoss, formatProfitLossResults } from "./get-profit-loss";

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

  const { all: earningsPerMarket } = formatProfitLossResults(results);

  const allTimeEarningsPerMarket = _.mapValues(earningsPerMarket, (outcomes: Array<Array<EarningsAtTime>>, marketId: Address) => {
    return outcomes.map((earnings: Array<EarningsAtTime>) => earnings === null ? null : earnings[earnings.length - 1].profitLoss);
  });

  console.log(_.keys(allTimeEarningsPerMarket));
  const marketBalances = await db.select("marketId", "outcome", "balance").from("balances_detail").whereIn("marketId", _.keys(allTimeEarningsPerMarket));

  const balancesByMarketOutcome = _.keyBy(marketBalances, (balance) => `${balance.marketId}_${balance.outcome}`);
  const positionsRows = _.flatMap(allTimeEarningsPerMarket, (earnings: Array<ProfitLoss|null>, marketId: Address) => {
    const byOutcomes = earnings.map((profitLoss: ProfitLoss|null, outcome: number) => {
      if (profitLoss) {
        let numShares = "0";
        const balance = balancesByMarketOutcome[`${marketId}_${outcome}`];
        if (balance) {
          numShares = balance.balance.toFixed();
        }
        return {
          marketId,
          outcome,
          numShares,
          realizedProfitLoss: profitLoss.realized,
          unrealizedProfitLoss: profitLoss.unrealized,
          numSharesAdjustedForUserIntention: profitLoss.position,
          averagePrice: profitLoss.meanOpenPrice
        };
      } else {
        return {
          marketId,
          outcome,
          realizedProfitLoss: "0",
          unrealizedProfitLoss: "0",
          numSharesAdjustedForUserIntention: "0",
          numShares: "0",
          averagePrice: "0"
        };
      }
    });

    if (typeof outcome === "number") return [byOutcomes[outcome]];
    return byOutcomes;
  });

  return positionsRows;
}

// Look up a user's current trading positions. Should take account (address) as a required parameter and market and outcome as optional parameters. Response should include the user's position after the trade, in both "raw" and "adjusted" formats -- the latter meaning that short positions are shown as negative for yesNo and scalar markets, and realized and unrealized profit/loss.
export function getUserTradingPositions(db: Knex, augur: Augur, universe: Address|null, account: Address, marketId: Address|null|undefined, outcome: number|null|undefined, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  queryUserTradingPositions(db, augur, universe, account, marketId, outcome, sortBy, isSortDescending, limit, offset).then((result) => { callback(null, result); }).catch((err) => callback(err));
}

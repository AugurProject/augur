import * as t from "io-ts";
import * as Knex from "knex";
import * as _ from "lodash";
import Augur from "augur.js";
import { numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";
import { Address, OutcomeParam, SortLimitParams } from "../../types";
import { EarningsAtTime, ProfitLoss } from "./get-profit-loss";

export const UserTradingPositionsParamsSpecific = t.type({
  universe: t.union([t.string, t.null, t.undefined]),
  marketId: t.union([t.string, t.null, t.undefined]),
  account: t.union([t.string, t.null, t.undefined]),
  outcome: t.union([OutcomeParam, t.number, t.null, t.undefined]),
});

export const UserTradingPositionsParams = t.intersection([
  UserTradingPositionsParamsSpecific,
  SortLimitParams,
]);

interface TradingPosition {
  marketId: string;
  outcome: number;
  numShares: string;
  realizedProfitLoss: string;
  unrealizedProfitLoss: string;
  numSharesAdjustedForUserIntention: string;
  averagePrice: string;
}

async function queryUniverse(db: Knex, marketId: Address): Promise<Address> {
  const market = await db.first("universe").from("markets").where({ marketId });
  if (!market || market.universe == null) throw new Error("If universe isn't provided, you must provide a valid marketId");
  return market.universe;
}

export async function getUserTradingPositions(db: Knex, augur: Augur, params: t.TypeOf<typeof UserTradingPositionsParams>): Promise<Array<TradingPosition>> {
  if (params.universe == null && params.marketId == null) throw new Error("Must provide reference to universe, specify universe or marketId");
  if (params.account == null) throw new Error("Missing required parameter: account");

  const universeId = params.universe || await queryUniverse(db, params.marketId!);
  const results = await getOutcomesProfitLoss(db, augur, Date.now(), universeId as Address, params.account, params.marketId || null, null, null, null);

  if (results === null) return [];

  const { all: earningsPerMarket } = await formatProfitLossResults(db, results);

  const allTimeEarningsPerMarket = _.mapValues(earningsPerMarket, (outcomes: Array<Array<EarningsAtTime>>, marketId: Address) => {
    return outcomes.map((earnings: Array<EarningsAtTime>) => earnings === null ? null : earnings[earnings.length - 1].profitLoss);
  });

  const marketBalances = await db.select("marketId", "outcome", "balance").from("balances_detail").whereIn("marketId", _.keys(allTimeEarningsPerMarket)).where({ owner: params.account });
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

    if (params.outcome != null && byOutcomes[params.outcome]) return [byOutcomes[params.outcome]];
    return byOutcomes;
  });

  return positionsRows;
}

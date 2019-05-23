import * as t from "io-ts";
import Knex from "knex";
import * as _ from "lodash";

import { Address, Augur, BigNumber, OutcomeParam, SortLimitParams } from "../../types";
import { BigNumber as BigNumberJS } from "bignumber.js";

import { ZERO } from "../../constants";
import { getAllOutcomesProfitLoss, ProfitLossResult, sumProfitLossResults } from "./get-profit-loss";

export const UserTradingPositionsParamsSpecific = t.type({
  universe: t.union([t.string, t.null, t.undefined]),
  marketId: t.union([t.string, t.null, t.undefined]),
  account: t.union([t.string, t.null, t.undefined]),
  outcome: t.union([OutcomeParam, t.number, t.null, t.undefined]),
});

export const UserTradingPositionsParams = t.intersection([
  UserTradingPositionsParamsSpecific,
  SortLimitParams,
  t.partial({
    endTime: t.number,
  }),
]);

interface TradingPosition extends ProfitLossResult {
  marketId: string;
  outcome: number;
  netPosition: BigNumber;
}

async function queryUniverse(db: Knex, marketId: Address): Promise<Address> {
  const market = await db
    .first("universe")
    .from("markets")
    .where({ marketId });
  if (!market || market.universe == null) throw new Error("If universe isn't provided, you must provide a valid marketId");
  return market.universe;
}

export async function getUserTradingPositions(db: Knex, augur: Augur, params: t.TypeOf<typeof UserTradingPositionsParams>): Promise<Array<TradingPosition>> {
  if (params.universe == null && params.marketId == null) throw new Error("Must provide reference to universe, specify universe or marketId");
  if (params.account == null) throw new Error("Missing required parameter: account");

  const endTime = params.endTime || Date.now() / 1000;
  const universeId = params.universe || (await queryUniverse(db, params.marketId!));
  const { profit: profitsPerMarket, marketOutcomes: numOutcomesByMarket } = await getAllOutcomesProfitLoss(db, augur, {
    universe: universeId,
    account: params.account,
    marketId: params.marketId || null,
    startTime: 0,
    endTime,
    periodInterval: endTime,
  });

  const marketTypes: Array<{marketId: string, marketType: string}> = await db("markets").select("marketId", "marketType").whereIn("marketId", _.keys(numOutcomesByMarket));
  const marketTypesByMarket = _.fromPairs(marketTypes.map((marketType) => [marketType.marketId, marketType.marketType]));

  if (_.isEmpty(profitsPerMarket)) return [];

  let positions = _.chain(profitsPerMarket)
    .mapValues((profits: Array<ProfitLossResult>, key: string) => {
      const [marketId, outcome] = key.split(",");
      const lastProfit = _.last(profits)!;
      return Object.assign(
        {
          marketId,
          outcome: parseInt(outcome, 10),
          netPosition: lastProfit.position,
        },
        lastProfit,
      );
    })
    .values()
    .value();

  const byMarket = _.groupBy(positions, "marketId");
  // netPositions
  // Outcomes that do not exist in the grouped array are ones for which the user holds no position
  // If there is only ONE missing outcome, then the user is short that outcome, in which case we want
  // to calculate its netPositions
  positions = _.chain(byMarket)
    .mapValues((outcomes: Array<TradingPosition>, marketId: string) => {
      const numOutcomes = numOutcomesByMarket[marketId];
      const marketType = marketTypesByMarket[marketId];

      const sortedOutcomes = _.sortBy(outcomes, "outcome")!;
      const outcomesWithZeroPosition = outcomes.filter((outcome) => outcome.position.eq(ZERO));

      const isMissingOneOutcome = numOutcomes === sortedOutcomes.length + 1;
      const hasOneZeroPosition = outcomesWithZeroPosition.length === 1;

      // We either must be missing one value, or have exactly one outcome with a zero position
      // to do anything special for netPosition, need to the do logical XNOR here to determine
      // if that's the case
      if ((isMissingOneOutcome && hasOneZeroPosition) || (!isMissingOneOutcome && !hasOneZeroPosition)) {
        console.log("LEAVING EARLY", isMissingOneOutcome, hasOneZeroPosition, numOutcomes);
        return sortedOutcomes;
      }

      if (isMissingOneOutcome) {
        const outcomeNumbers = _.range(numOutcomes);
        const missingOutcome = _.findIndex(_.zip(sortedOutcomes, outcomeNumbers), ([outcomePl, outcomeNumber]) => (!outcomePl || outcomePl.outcome !== outcomeNumber!));
        outcomesWithZeroPosition.push({
          marketId,
          outcome: missingOutcome,
          netPosition: ZERO,
          position: ZERO,
          realized: ZERO,
          unrealized: ZERO,
          total: ZERO,
          cost: ZERO,
          averagePrice: ZERO,
          timestamp: _.first(sortedOutcomes)!.timestamp,
        });
      }

      const nonZeroPositionOutcomePls = _.filter(sortedOutcomes, (outcome) => !outcome.position.eq(ZERO));
      const minimumPosition = new BigNumber(BigNumberJS.minimum(..._.map(nonZeroPositionOutcomePls, "position").map((p) =>new BigNumberJS(p.toString()))).toString());
      const adjustedOutcomePls = _.map(nonZeroPositionOutcomePls, (outcomePl) => Object.assign({}, outcomePl, { netPosition: outcomePl.netPosition.minus(minimumPosition) }));
      const shortOutcome = Object.assign({}, _.first(outcomesWithZeroPosition)!, { netPosition: minimumPosition.multipliedBy(new BigNumber(-1)) });

      if (marketType === "categorical") return _.concat(adjustedOutcomePls, shortOutcome);
      if (shortOutcome.outcome === 1) {
        const result = sumProfitLossResults(shortOutcome, _.first(adjustedOutcomePls)!);
        result.position = shortOutcome.position;
        return [result];
      }
      return nonZeroPositionOutcomePls;
    })
    .values()
    .flatten()
    .value();

  if (params.outcome === null || typeof params.outcome === "undefined") return positions;

  return _.filter(positions, { outcome: params.outcome });
}

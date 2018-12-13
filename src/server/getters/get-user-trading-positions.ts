import * as t from "io-ts";
import * as Knex from "knex";
import * as _ from "lodash";
import Augur from "augur.js";
import { ZERO  } from "../../constants";
import { numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";
import { Address, OutcomeParam, SortLimitParams } from "../../types";
import { getAllOutcomesProfitLoss, ProfitLossResult } from "./get-profit-loss";

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

interface TradingPosition extends ProfitLossResult {
  marketId: string;
  outcome: number;
  netPosition: BigNumber;
}

async function queryUniverse(db: Knex, marketId: Address): Promise<Address> {
  const market = await db.first("universe").from("markets").where({ marketId });
  if (!market || market.universe == null) throw new Error("If universe isn't provided, you must provide a valid marketId");
  return market.universe;
}

export async function getUserTradingPositions(db: Knex, augur: Augur, params: t.TypeOf<typeof UserTradingPositionsParams>): Promise<Array<TradingPosition>> {
  if (params.universe == null && params.marketId == null) throw new Error("Must provide reference to universe, specify universe or marketId");
  if (params.account == null) throw new Error("Missing required parameter: account");

  const universeId = params.universe || (await queryUniverse(db, params.marketId!));
  const { profit: profitsPerMarket } = await getAllOutcomesProfitLoss(db, augur, {
    universe: universeId,
    account: params.account,
    marketId: params.marketId || null,
    startTime: null,
    endTime: null,
    periodInterval: null,
  });

  if (_.isEmpty(profitsPerMarket)) return [];

  const positions = _.chain(profitsPerMarket)
    .mapValues((profits: Array<ProfitLossResult>, key: string) => {
      const [marketId, outcome] = key.split(",");
      return Object.assign({
        marketId,
        outcome: parseInt(outcome, 10),
        netPosition: ZERO,
      }, _.last(profits));
    })
    .values()
    .value();

  if (params.outcome === null || typeof params.outcome === "undefined") return positions;

  return _.filter(positions, { outcome: params.outcome });
}

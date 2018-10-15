import * as t from "io-ts";
import * as Knex from "knex";
import Augur from "augur.js";
import { Address, UniverseInfoRow, UIUniverseInfoRow } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { normalizePayouts, normalizedPayoutsToFixed } from "./database";

export const UniverseInfoParams = t.type({
  universe: t.string,
  account: t.string,
});

interface ParentUniverseRow {
  parentUniverse: Address;
}

export async function getUniversesInfo(db: Knex, augur: Augur, params: t.TypeOf<typeof UniverseInfoParams>): Promise<Array<UIUniverseInfoRow<string>>> {
  const parentUniverseRow: ParentUniverseRow = await db.select("parentUniverse").from("universes").where("universe", params.universe).first();
  if (parentUniverseRow === undefined) return [];
  const query = db.select([
    "universes.universe",
    "universes.parentUniverse",
    "payouts.isInvalid",
    "payouts.payout0",
    "payouts.payout1",
    "payouts.payout2",
    "payouts.payout3",
    "payouts.payout4",
    "payouts.payout5",
    "payouts.payout6",
    "payouts.payout7",
    "balances.balance",
    "token_supply.supply",
    db.raw("count(markets.marketId) as numMarkets")]).from("universes")
    .where("universes.parentUniverse", params.universe) // Children
    .orWhere("universes.parentUniverse", parentUniverseRow.parentUniverse) // Siblings
    .orWhere("universes.universe", params.universe) // Universe
    .orWhere("universes.universe", parentUniverseRow.parentUniverse) // Parent
    .leftJoin("token_supply", "token_supply.token", "universes.reputationToken")
    .leftJoin("balances", function () {
      this
        .on("balances.owner", db.raw("?", [params.account]))
        .on("balances.token", "universes.reputationToken");
    })
    .leftJoin("markets", "markets.universe", "universes.universe")
    .leftJoin("payouts", "payouts.payoutId", "universes.payoutId")
    .groupBy("universes.universe");
  const universeInfoRows: Array<UniverseInfoRow<BigNumber>> = await query;
  return universeInfoRows.map((row: UniverseInfoRow<BigNumber>) => {
    return formatBigNumberAsFixed<UIUniverseInfoRow<BigNumber>, UIUniverseInfoRow<string>>({
      universe: row.universe,
      parentUniverse: row.parentUniverse,
      balance: row.balance || "0",
      supply: row.supply || "0",
      numMarkets: row.numMarkets,
      payout: normalizedPayoutsToFixed(normalizePayouts(row)).payout,
      isInvalid: Boolean(row.isInvalid),
    });
  });
}

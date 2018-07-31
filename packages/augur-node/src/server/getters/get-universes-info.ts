import Augur from "augur.js";
import * as Knex from "knex";
import { Address, UniverseInfoRow, UIUniverseInfoRow } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { normalizePayouts, normalizedPayoutsToFixed } from "./database";

interface ParentUniverseRow {
  parentUniverse: Address;
}

export function getUniversesInfo(db: Knex, augur: Augur, universe: Address, account: Address, callback: (err: Error|null, result?: any) => void): void {
  if (universe == null || account == null) return callback(new Error("Must provide both universe and account"));

  const query = db.select("parentUniverse").from("universes").where("universe", universe).first();

  query.asCallback((err: Error|null, parentUniverseRow: ParentUniverseRow) => {
    if (err) return callback(err);
    if (parentUniverseRow === undefined) return callback(null, []);

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
      .where("universes.parentUniverse", universe) // Children
      .orWhere("universes.parentUniverse", parentUniverseRow.parentUniverse) // Siblings
      .orWhere("universes.universe", universe) // Universe
      .orWhere("universes.universe", parentUniverseRow.parentUniverse) // Parent
      .leftJoin("token_supply", "token_supply.token", "universes.reputationToken")
      .leftJoin("balances", function () {
        this
          .on("balances.owner", db.raw("?", [account]))
          .on("balances.token", "universes.reputationToken");
        })
      .leftJoin("markets", "markets.universe", "universes.universe")
      .leftJoin("payouts", "payouts.payoutId", "universes.payoutId")
      .groupBy("universes.universe");

    query.asCallback((err: Error|null, universeInfoRows: Array<UniverseInfoRow<BigNumber>>): void => {
      if (err) return callback(err);
      callback(null, universeInfoRows.map((row: UniverseInfoRow<BigNumber>) => {
        return formatBigNumberAsFixed<UIUniverseInfoRow<BigNumber>, UIUniverseInfoRow<string>>({
          universe: row.universe,
          parentUniverse: row.parentUniverse,
          balance: row.balance || "0",
          supply: row.supply || "0",
          numMarkets: row.numMarkets,
          payout: normalizedPayoutsToFixed(normalizePayouts(row)).payout,
          isInvalid: row.isInvalid,
        });
      }));
    });
  });
}

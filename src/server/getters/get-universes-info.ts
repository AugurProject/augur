import Augur from "augur.js";
import * as Knex from "knex";
import { Address, UniverseInfoRow } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";

interface ParentUniverseRow {
  parentUniverse: Address;
}

export function getUniversesInfo(db: Knex, augur: Augur, universe: Address, account: Address, callback: (err: Error|null, result?: any) => void): void {
  if (universe == null || account == null) return callback(new Error("Must provide both universe and account"));

  const query = db.select("parentUniverse").from("universes").where("universe", universe).first();

  query.asCallback((err: Error|null, parentUniverseRow: ParentUniverseRow) => {
    if (err) return callback(err);

    const query = db.select(["universes.universe", "universes.parentUniverse", "balances.balance", "token_supply.supply", db.raw("count(markets.marketId) as numMarkets")]).from("universes")
      .where("universes.parentUniverse", universe) // Children
      .orWhere("universes.parentUniverse", parentUniverseRow.parentUniverse) // Siblings
      .orWhere("universes.universe", universe) // Universe
      .orWhere("universes.universe", parentUniverseRow.parentUniverse) // Parent
      .leftJoin("token_supply", "token_supply.token", "universes.reputationToken")
      .leftJoin("balances", function () {
        this
          .on("balances.owner", db.raw('"' + account + '"'))
          .on("balances.token", "universes.reputationToken");
        })
      .leftJoin("markets", "markets.universe", "universes.universe")
      .groupBy("universes.universe");

    query.asCallback((err: Error|null, universeInfoRows: Array<UniverseInfoRow<BigNumber>>): void => {
      if (err) return callback(err);
      callback(null, universeInfoRows.map((row: UniverseInfoRow<BigNumber>) => {
        return formatBigNumberAsFixed(row);
      }));
    });
  });
}

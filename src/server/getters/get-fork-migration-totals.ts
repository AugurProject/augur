import * as Knex from "knex";
import Augur from "augur.js";
import { Address } from "../../types";
import { ForkMigrationTotalsRow, UIForkMigrationTotals } from "../../types";

export function getForkMigrationTotals(db: Knex, augur: Augur, parentUniverse: Address, callback: (err: Error|null, result?: any) => void): void {
  const query = db.select([
      "universe",
      "payouts.isInvalid",
      "payouts.payout0",
      "payouts.payout1",
      "payouts.payout2",
      "payouts.payout3",
      "payouts.payout4",
      "payouts.payout5",
      "payouts.payout6",
      "payouts.payout7",
      "token_supply.supply AS repTotal"]).from("universes")
    .join("token_supply", "universes.reputationToken", "token_supply.token")
    .join("payouts", "payouts.marketId", "universes.universe")
    .where("universes.parentUniverse", parentUniverse);

  query.asCallback((err: Error|null, forkMigrationTotals: Array<ForkMigrationTotalsRow>): void => {
    if (err) return callback(err);
    callback(null, forkMigrationTotals.reduce((acc: UIForkMigrationTotals, cur) => {
      const payoutNumerators: Array<string|number|null> = [cur.payout0, cur.payout1, cur.payout2, cur.payout3, cur.payout4, cur.payout5, cur.payout6, cur.payout7].filter((payout: string|number|null): boolean => payout != null);
      acc[cur.universe] = {
        universe: cur.universe,
        repTotal: cur.repTotal,
        isInvalid: cur.isInvalid,
        payout: payoutNumerators as Array<string|number>,
      };
      return acc;
    }, {}));
  });
}

import * as Knex from "knex";
import Augur from "augur.js";
import { BigNumber } from "bignumber.js";
import { Address, ForkMigrationTotalsRow, UIForkMigrationTotals, UIForkMigrationTotalsRow } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";

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

  query.asCallback((err: Error|null, forkMigrationTotals: Array<ForkMigrationTotalsRow<BigNumber>>): void => {
    if (err) return callback(err);
    callback(null, forkMigrationTotals.reduce((acc: UIForkMigrationTotals<string>, cur) => {
      const payout: Array<string> = [
        cur.payout0, cur.payout1, cur.payout2, cur.payout3, cur.payout4, cur.payout5, cur.payout6, cur.payout7,
      ].filter((payout: BigNumber|null): boolean => payout != null).map( (payout: BigNumber) => payout.toFixed());
      const universeTotals = formatBigNumberAsFixed<Partial<UIForkMigrationTotalsRow<BigNumber>>, Partial<UIForkMigrationTotalsRow<string>>>({
        universe: cur.universe,
        repTotal: cur.repTotal,
        isInvalid: cur.isInvalid,
      });
      acc[cur.universe] = Object.assign({ payout }, universeTotals) as UIForkMigrationTotalsRow<string>;
      return acc;
    }, {}));
  });
}

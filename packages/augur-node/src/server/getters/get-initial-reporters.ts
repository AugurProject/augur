import * as Knex from "knex";
import Augur from "augur.js";
import { Address } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { InitialReportersRow, UIInitialReporters } from "../../types";

export function getInitialReporters(db: Knex, augur: Augur, universe: Address, reporter: Address, redeemed: boolean|null|undefined, withRepBalance: boolean|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  let query = db("initial_reports")
    .select(["marketID", "reporter", "amountStaked", "initialReporter", "redeemed", "isDesignatedReporter", "balances.balance AS repBalance"])
    .select(["transactionHash", "initial_reports.blockNumber", "logIndex", "blocks.timestamp"])
    .join("balances", "balances.owner", "=", "initial_reports.initialReporter")
    .join("universes", "universes.reputationToken", "balances.token")
    .join("blocks", "initial_reports.blockNumber", "blocks.blockNumber")
    .where({reporter})
    .where("universes.universe", universe);

  if (withRepBalance) query = query.where("repBalance", ">", "0");
  if (redeemed != null) query = query.where({ redeemed });

  query.asCallback((err: Error|null, initialReporters: Array<InitialReportersRow<BigNumber>>): void => {
    if (err) return callback(err);

    callback(null, initialReporters.reduce((acc: UIInitialReporters<string>, cur) => {
      acc[cur.initialReporter] = formatBigNumberAsFixed<InitialReportersRow<BigNumber>, InitialReportersRow<string>>(cur);
      return acc;
    }, {}));
  });
}

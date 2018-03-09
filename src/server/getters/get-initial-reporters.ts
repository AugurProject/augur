import * as Knex from "knex";
import Augur from "augur.js";
import { Address } from "../../types";
import { InitialReportersRow, UIInitialReporters } from "../../types";

export function getInitialReporters(db: Knex, augur: Augur, reporter: Address, redeemed: boolean|null|undefined, withRepBalance: boolean|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  let query = db.select(["marketID", "reporter", "amountStaked", "initialReporter", "redeemed", "isDesignatedReporter", "balances.balance AS repBalance"]).from("initial_reports")
    .join("balances", function () {
      this
        .on("balances.owner", db.raw("initial_reports.initialReporter"));
      })
    .where("balances.token", augur.contracts.addresses[augur.rpc.getNetworkID()].ReputationToken)
    .where({ reporter });
  if (withRepBalance) query = query.where("repBalance", ">", "0");
  if (redeemed != null) query = query.where({ redeemed });

  query.asCallback((err: Error|null, initialReporters: Array<InitialReportersRow>): void => {
    if (err) return callback(err);

    callback(null, initialReporters.reduce((acc: UIInitialReporters, cur) => {acc[cur.initialReporter] = cur; return acc; }, {}));
  });
}

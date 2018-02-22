import * as Knex from "knex";
import { Address } from "../../types";
import { InitialReportersRow } from "../../types";

export function getInitialReporters(db: Knex, reporter: Address, redeemed: boolean|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  let query = db.select(["marketId", "reporter", "amountStaked", "initialReporter", "redeemed"]).from("initial_reports").where({ reporter });
  if (redeemed != null) query = query.where({ redeemed });

  query.asCallback((err: Error|null, initialReporters: Array<InitialReportersRow>): void => {
    if (err) return callback(err);

    callback(null, initialReporters);
  });
}

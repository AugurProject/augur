import * as Knex from "knex";
import { Address } from "../../types";
import { queryModifier } from "./database";
import { InitialReportersRow } from "../../types";

export function getInitialReporters(db: Knex, reporter: Address, callback: (err: Error|null, result?: any) => void): void {
  const query = db.select(["marketID", "reporter", "amountStaked", "initialReporter"]).from("initial_reports").where({ reporter });

  query.asCallback((err: Error|null, initialReporters: Array<InitialReportersRow>): void => {
    if (err) return callback(err);

    callback(null, initialReporters);
  });
}

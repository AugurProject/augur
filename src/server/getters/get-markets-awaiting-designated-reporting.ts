import * as Knex from "knex";
import { Address } from "../../types";

// Look up all markets that are currently awaiting designated (automated) reporting. Should accept an designatedReporterAddress parameter that allows me to filter by designated reporter address.
export function getMarketsAwaitingDesignatedReporting(db: Knex, designatedReporter: Address, callback: (err: Error|null, result?: any) => void): void {

}

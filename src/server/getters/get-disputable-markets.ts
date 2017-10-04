import * as Knex from "knex";
import { Address } from "../../types";

// Look up all markets that are currently able to be disputed. Response should include the value of the bond needed to actually dispute the result.
export function getDisputableMarkets(db: Knex, reportingWindow: Address, callback: (err?: Error|null, result?: any) => void): void {

}

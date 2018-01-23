import * as Knex from "knex";
import { Address } from "../../types";

// Look up all markets that are currently able to be disputed. Response should include the value of the bond needed to actually dispute the result.
export function getDisputableMarkets(db: Knex, feeWindow: Address, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  return callback(new Error("getDisputableMarkets not yet implemented"));
}

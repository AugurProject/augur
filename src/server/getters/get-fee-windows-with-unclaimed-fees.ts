import * as Knex from "knex";
import { Address } from "../../types";

// Input: User Address
// Output: Reporting Windows With Unclaimed Fees
export function getFeeWindowsWithUnclaimedFees(db: Knex, universe: Address, account: Address, callback: (err: Error|null, result?: any) => void): void {
    return callback(new Error("getfeeWindowsWithUnclaimedFees not yet implemented"));
}

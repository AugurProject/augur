import * as Knex from "knex";
import { Address } from "../../types";

// Input: User Address
// Output: Reporting Windows With Unclaimed Fees
export function getReportingWindowsWithUnclaimedFees(db: Knex, account: Address, callback: (err: Error|null, result?: any) => void): void {

}

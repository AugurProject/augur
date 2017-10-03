import { Database } from "sqlite3";
import { Address } from "./types";

// Input: User Address
// Output: Reporting Windows With Unclaimed Fees
export function getReportingWindowsWithUnclaimedFees(db: Database, account: Address, callback: (err?: Error|null, result?: any) => void) {

}

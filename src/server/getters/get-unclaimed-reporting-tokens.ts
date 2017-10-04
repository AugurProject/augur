import { Database } from "sqlite3";
import { Address } from "../../types";

// Input: User Address
// Output: Unclaimed Reporting Tokens
export function getUnclaimedReportingTokens(db: Database, account: Address, callback: (err?: Error|null, result?: any) => void): void {

}

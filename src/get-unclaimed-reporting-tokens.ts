import { SqlLiteDb, Address } from "./types";

// Input: User Address
// Output: Unclaimed Reporting Tokens
export function getUnclaimedReportingTokens(db: SqlLiteDb, account: Address, callback: (err?: Error|null, result?: any) => void) {

}

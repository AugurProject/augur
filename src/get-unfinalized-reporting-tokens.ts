import { SqlLiteDb, Address } from "./types";

// Input: User Address
// Output: Unfinalized Reporting Tokens
export function getUnfinalizedReportingTokens(db: SqlLiteDb, account: Address, callback: (err?: Error|null, result?: any) => void) {

}

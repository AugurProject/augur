import { SqlLiteDb, Address } from "./types";

// Input: User Address + Date Range
// Output: All Reporting Tokens
export function getAllReportingTokens(db: SqlLiteDb, account: Address, dateRange: number[]|null, callback: (err?: Error|null, result?: any) => void) {

}

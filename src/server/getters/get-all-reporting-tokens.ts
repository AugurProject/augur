import { Database } from "sqlite3";
import { Address } from "../../types";

// Input: User Address + Date Range
// Output: All Reporting Tokens
export function getAllReportingTokens(db: Database, account: Address, dateRange: number[]|null, callback: (err?: Error|null, result?: any) => void): void {

}

import * as Knex from "knex";
import { Address } from "../../types";

// Input: User Address + Date Range
// Output: All Reporting Tokens
export function getAllReportingTokens(db: Knex, account: Address, dateRange: Array<number>|null, callback: (err: Error|null, result?: any) => void): void {

}

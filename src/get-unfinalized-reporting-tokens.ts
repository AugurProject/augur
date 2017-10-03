import { Database } from "sqlite3";
import { Address } from "./types";

// Input: User Address
// Output: Unfinalized Reporting Tokens
export function getUnfinalizedReportingTokens(db: Database, account: Address, callback: (err?: Error|null, result?: any) => void) {

}

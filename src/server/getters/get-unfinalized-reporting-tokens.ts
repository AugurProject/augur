import * as Knex from "knex";
import { Address } from "../../types";

// Input: User Address
// Output: Unfinalized Reporting Tokens
export function getUnfinalizedReportingTokens(db: Knex, account: Address, callback: (err: Error|null, result?: any) => void): void {

}

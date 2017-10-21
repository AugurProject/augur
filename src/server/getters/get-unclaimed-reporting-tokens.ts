import * as Knex from "knex";
import { Address } from "../../types";

// Input: User Address
// Output: Unclaimed Reporting Tokens
export function getUnclaimedReportingTokens(db: Knex, account: Address, callback: (err: Error|null, result?: any) => void): void {

}

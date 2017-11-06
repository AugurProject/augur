import * as Knex from "knex";
import { Address } from "../../types";

// Input: User Address + Date Range
// Output: All Stake Tokens
export function getAllStakeTokens(db: Knex, universe: Address, account: Address, dateRange: Array<number>|null, callback: (err: Error|null, result?: any) => void): void {

}

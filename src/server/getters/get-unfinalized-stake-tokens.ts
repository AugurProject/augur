import * as Knex from "knex";
import { Address } from "../../types";

// Input: User Address
// Output: Unfinalized Reporting Tokens
export function getUnfinalizedStakeTokens(db: Knex, universe: Address, account: Address, callback: (err: Error|null, result?: any) => void): void {

}

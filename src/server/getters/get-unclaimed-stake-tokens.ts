import * as Knex from "knex";
import { Address } from "../../types";

// Input: User Address
// Output: Unclaimed Reporting Tokens
export function getUnclaimedStakeTokens(db: Knex, universe: Address, account: Address, callback: (err: Error|null, result?: any) => void): void {

}

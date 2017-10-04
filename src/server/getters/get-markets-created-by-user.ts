import * as Knex from "knex";
import { Address } from "../../types";

// Should return the total amount of fees earned so far by the market creator.
export function getMarketsCreatedByUser(db: Knex, account: Address, callback: (err?: Error|null, result?: any) => void): void {

}

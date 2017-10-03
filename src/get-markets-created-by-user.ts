import { Database } from "sqlite3";
import { Address } from "./types";

// Should return the total amount of fees earned so far by the market creator.
export function getMarketsCreatedByUser(db: Database, account: Address, callback: (err?: Error|null, result?: any) => void) {

}

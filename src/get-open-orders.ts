import { Database } from "sqlite3";
import { Address } from "./types";

// market, outcome, creator, orderType, limit, sort
export function getOpenOrders(db: Database, market: Address|null, outcome: number|null, orderType: string|null, creator: Address|null, callback: (err?: Error|null, result?: any) => void) {

}

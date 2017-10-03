import { Database } from "sqlite3";
import { Address } from "./types";

// Input: User Address + Date Range
// Output: All Closed Orders
export function getClosedOrders(db: Database, account: Address, dateRange: number[]|null, callback: (err?: Error|null, result?: any) => void) {

}

import { SqlLiteDb, Address } from "./types";

// Input: User Address + Date Range
// Output: All Closed Orders
export function getClosedOrders(db: SqlLiteDb, account: Address, dateRange: number[]|null, callback: (err?: Error|null, result?: any) => void) {

}

import * as Knex from "knex";
import { Address } from "../../types";

// Input: User Address + Date Range
// Output: All Closed Orders
export function getClosedOrders(db: Knex, account: Address, dateRange: Array<number>|null, callback: (err: Error|null, result?: any) => void): void {

}

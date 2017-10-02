import { SqlLiteDb, Address } from "./types";

// market, outcome, creator, orderType, limit, sort
export function getOpenOrders(db: SqlLiteDb, market: Address|null, outcome: number|null, orderType: string|null, creator: Address|null, callback: (err?: Error|null, result?: any) => void) {

}

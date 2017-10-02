import { SqlLiteDb, Address } from "./types";

// Input: Market ID
// Output: Detailed info about the market, including its order book and price/trading history
export function getDetailedMarketInfo(db: SqlLiteDb, market: Address, callback: (err?: Error|null, result?: any) => void) {

}

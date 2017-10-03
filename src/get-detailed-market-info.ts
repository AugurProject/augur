import { Database } from "sqlite3";
import { Address } from "./types";

// Input: Market ID
// Output: Detailed info about the market, including its order book and price/trading history
export function getDetailedMarketInfo(db: Database, market: Address, callback: (err?: Error|null, result?: any) => void) {

}

import * as Knex from "knex";
import { Address } from "../../types";

// Input: Market ID
// Output: Detailed info about the market, including its order book and price/trading history
export function getDetailedMarketInfo(db: Knex, market: Address, callback: (err?: Error|null, result?: any) => void): void {

}

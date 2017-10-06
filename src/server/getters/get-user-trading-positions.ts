import { Database } from "sqlite3";
import { Address } from "../../types";

// Look up a user's current trading positions. Should take account (address) as a required parameter and market and outcome as optional parameters. Response should include the position in both "raw" and "adjusted-for-user-intention" formats, realized and unrealized profit/loss, and max possible gain/loss at market resolution.
export function getUserTradingPositions(db: Database, account: Address, marketID: Address|null, outcome: number|null, callback: (err?: Error|null, result?: any) => void): void {

}

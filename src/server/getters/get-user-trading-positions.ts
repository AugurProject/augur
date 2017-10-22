import * as Knex from "knex";
import { Address } from "../../types";
import { sortDirection } from "../../utils/sort-direction";

// Look up a user's current trading positions. Should take account (address) as a required parameter and market and outcome as optional parameters. Response should include the position in both "raw" and "adjusted-for-user-intention" formats, realized and unrealized profit/loss, and max possible gain/loss at market resolution.
export function getUserTradingPositions(db: Knex, account: Address, marketID: Address|null|undefined, outcome: number|null|undefined, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  // query = query.orderBy(sortBy || "tradeTime", sortDirection(isSortDescending, "desc"));
  // if (limit != null) query = query.limit(limit);
  // if (offset != null) query = query.offset(offset);
}

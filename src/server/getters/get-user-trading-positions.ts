import * as Knex from "knex";
import { Address } from "../../types";
import { sortDirection } from "../../utils/sort-direction";
import { queryModifier } from "./database";

// Look up a user's current trading positions. Should take account (address) as a required parameter and market and outcome as optional parameters. Response should include the user's position after the trade, in both "raw" and "adjusted-for-user-intention" formats -- the latter meaning that short positions are shown as negative, rather than as positive positions in the other outcomes), and realized and unrealized profit/loss.
export function getUserTradingPositions(db: Knex, account: Address, marketID: Address|null|undefined, outcome: number|null|undefined, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  let query = db.select(["marketID", "outcome", "numShares", "numSharesAdjustedForUserIntention", "realizedProfitLoss", "unrealizedProfitLoss"]).from("positions").where({ account });
  if (marketID != null) query = query.andWhere({ marketID });
  if (outcome != null) query = query.andWhere({ outcome });
  query = queryModifier(query, "outcome", "asc", sortBy, isSortDescending, limit, offset);
  query.asCallback(callback);
}

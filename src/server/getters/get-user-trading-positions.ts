import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { Address, PositionsRow } from "../../types";
import { queryModifier } from "./database";

// Look up a user's current trading positions. Should take account (address) as a required parameter and market and outcome as optional parameters. Response should include the user's position after the trade, in both "raw" and "adjusted" formats -- the latter meaning that short positions are shown as negative for yesNo and scalar markets, and realized and unrealized profit/loss.
export function getUserTradingPositions(db: Knex, universe: Address|null, account: Address, marketId: Address|null|undefined, outcome: number|null|undefined, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  if (universe == null && marketId == null ) return callback(new Error("Must provide reference to universe, specify universe or marketId"));
  if (account == null) return callback(new Error("Missing required parameter: account"));
  const query = db.select(["positions.marketId", "positions.outcome", "positions.averagePrice", "positions.numShares", "positions.realizedProfitLoss", "positions.unrealizedProfitLoss", "positions.numSharesAdjustedForUserIntention"]).from("positions").join("markets", "positions.marketId", "markets.marketId").where("positions.account", account);
  if (universe != null) query.where("markets.universe", universe);
  if (marketId != null) query.where("positions.marketId", marketId);
  queryModifier(db, query, "outcome", "asc", sortBy, isSortDescending, limit, offset, (err: Error|null, positionsRows?: Array<PositionsRow<BigNumber>>): void => {
    if (err) return callback(err);
    if (!positionsRows) return callback(new Error("Internal error retrieving positions"));
    if (outcome != null) {
      positionsRows = positionsRows.filter((positionsRow: PositionsRow<BigNumber>): boolean => positionsRow.outcome === outcome);
    }
    callback(null, positionsRows.map((position) => formatBigNumberAsFixed<PositionsRow<BigNumber>, PositionsRow<string>>(position)));
  });
}

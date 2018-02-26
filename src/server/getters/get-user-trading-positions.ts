import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, PositionsRow } from "../../types";
import { queryModifier } from "./database";

interface PositionsRowWithMarketType extends PositionsRow {
  marketType: string;
}

interface PositionsRowWithNumSharesAdjusted extends PositionsRow {
  numSharesAdjusted: string|number;
}

// Look up a user's current trading positions. Should take account (address) as a required parameter and market and outcome as optional parameters. Response should include the user's position after the trade, in both "raw" and "adjusted" formats -- the latter meaning that short positions are shown as negative for binary and scalar markets, and realized and unrealized profit/loss.
export function getUserTradingPositions(db: Knex, universe: Address|null, account: Address, marketId: Address|null|undefined, outcome: number|null|undefined, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: any) => void): void {
  if (universe == null && marketId == null ) return callback(new Error("Must provide reference to universe, specify universe or marketId"));
  if (account == null) return callback(new Error("Missing required parameter: account"));
  const query = db.select(["positions.marketId", "positions.outcome", "positions.averagePrice", "positions.numShares", "positions.realizedProfitLoss", "positions.unrealizedProfitLoss", "markets.marketType"]).from("positions").join("markets", "positions.marketId", "markets.marketId").where("positions.account", account);
  if (universe != null) query.where("markets.universe", universe);
  if (marketId != null) query.where("positions.marketId", marketId);
  queryModifier(query, "outcome", "asc", sortBy, isSortDescending, limit, offset);
  query.asCallback((err: Error|null, positionsRows?: Array<PositionsRowWithMarketType>): void => {
    if (err) return callback(err);
    if (!positionsRows) return callback(new Error("positions not found"));
    const positionsRowsWithNumSharesAdjusted: Array<PositionsRowWithNumSharesAdjusted> = positionsRows.map((positionsRow: PositionsRowWithMarketType): PositionsRowWithNumSharesAdjusted => {
      let numSharesAdjusted;
      if (positionsRow.marketType === "categorical" || positionsRow.outcome === 0) {
        numSharesAdjusted = positionsRow.numShares;
      } else {
        const otherOutcomeNumShares = positionsRows.filter((allPositionsRow: PositionsRowWithMarketType): boolean => allPositionsRow.marketId === positionsRow.marketId && allPositionsRow.outcome === 0)[0].numShares;
        const bnNumShares = new BigNumber(positionsRow.numShares!, 10);
        const bnOtherShares = new BigNumber(otherOutcomeNumShares!, 10);
        numSharesAdjusted = bnNumShares.minus(bnOtherShares).toFixed()!;
      }
      delete positionsRow.marketType;
      return Object.assign({}, positionsRow, { numSharesAdjusted: numSharesAdjusted! });
    });
    if (outcome != null) {
      return callback(null, positionsRowsWithNumSharesAdjusted.filter((positionsRowWithNumSharesAdjusted: PositionsRowWithNumSharesAdjusted): boolean => positionsRowWithNumSharesAdjusted.outcome === outcome));
    }
    callback(null, positionsRowsWithNumSharesAdjusted);
  });
}

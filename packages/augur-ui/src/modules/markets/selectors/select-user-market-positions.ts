import { createSelector } from "reselect";
import {
  selectAccountPositionsState,
  selectMarketInfosState
} from "store/select-state";
import { PositionData } from "modules/types";
import { positionSummary } from "modules/positions/selectors/positions-summary";
import { Getters } from "@augurproject/sdk";

function selectMarketsDataStateMarket(state, marketId) {
  return selectMarketInfosState(state)[marketId];
}

function selectMarketUserPositions(state, marketId) {
  return selectAccountPositionsState(state)[marketId];
}

export const selectUserMarketPositions = createSelector(
  selectMarketsDataStateMarket,
  selectMarketUserPositions,
  (marketInfo, marketAccountPositions): Getters.Users.TradingPosition[] => {
    if (!marketInfo || !marketAccountPositions || !marketAccountPositions.tradingPositions) return [];

      const userPositions = Object.values(
        marketAccountPositions.tradingPositions || []
      ).map((value) => {
        const position = value as PositionData;
        const outcome = marketInfo.outcomes[position.outcome];
        return {
          ...positionSummary(position, outcome),
          outcomeName: outcome.description
        };
      });
      return userPositions;
  }
);

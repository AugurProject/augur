import { createSelector } from "reselect";
import {
  selectAccountPositionsState, selectAccountRawPositionsState,
} from "appStore/select-state";
import { positionSummary } from "modules/positions/selectors/positions-summary";
import type { Getters } from "@augurproject/sdk";
import { selectMarket } from "modules/markets/selectors/market";
import { MarketData } from "modules/types";

function selectMarketsDataStateMarket(state, marketId): MarketData {
  return selectMarket(marketId);
}

function selectMarketUserPositions(state, marketId) {
  return selectAccountPositionsState(state)[marketId];
}

function selectMarketUserRawPositions(state, marketId) {
  return selectAccountRawPositionsState(state)[marketId];
}

export const selectUserMarketPositions = createSelector(
  selectMarketsDataStateMarket,
  selectMarketUserPositions,
  (marketInfo, marketAccountPositions): Getters.Users.TradingPosition[] => {
    if (!marketInfo || !marketAccountPositions || !marketAccountPositions.tradingPositions) return [];
      const { marketType, reportingState } = marketInfo;
      const isFullLoss = marketAccountPositions.tradingPositionsPerMarket?.fullLoss;
      const userPositions = Object.values(
        marketAccountPositions.tradingPositions || []
      ).map((value) => {
        const position = value as Getters.Users.TradingPosition;
        const outcome = marketInfo.outcomesFormatted[position.outcome];
        return {
          ...positionSummary(position, outcome, marketType, reportingState, isFullLoss),
          outcomeName: outcome.description
        };
      });
      return userPositions;
  }
);


export const selectUserMarketRawPositions = createSelector(
  selectMarketsDataStateMarket,
  selectMarketUserRawPositions,
  (marketInfo, marketAccountPositions): Getters.Users.TradingPosition[] => {
    if (!marketInfo || !marketAccountPositions || !marketAccountPositions.tradingPositions) return [];
      const { marketType, reportingState } = marketInfo;
      const isFullLoss = marketAccountPositions.tradingPositionsPerMarket?.fullLoss;
      const userPositions = Object.values(
        marketAccountPositions.tradingPositions || []
      ).map((value) => {
        const position = value as Getters.Users.TradingPosition;
        const outcome = marketInfo.outcomesFormatted[position.outcome];
        return {
          ...positionSummary(position, outcome, marketType, reportingState, isFullLoss),
          outcomeName: outcome.description
        };
      });
      return userPositions;
  }
);

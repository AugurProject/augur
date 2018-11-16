import { createSelector } from "reselect";
import { selectMarketsDataState } from "src/select-state";

import { selectMarket } from "modules/markets/selectors/market";

const selectMarketsSelector = () =>
  createSelector(selectMarketsDataState, marketsData => {
    if (!marketsData) return [];
    return Object.keys(marketsData).map(marketId => {
      if (!marketId || !marketsData[marketId]) return {};
      return selectMarket(marketId);
    });
  });

export const selectMarkets = selectMarketsSelector();

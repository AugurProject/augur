import { createSelector } from "reselect";

import store from "src/store";
import { selectMarkets } from "modules/markets/selectors/markets-all";
import { selectAccountPositionsState } from "src/select-state";

// TODO
export default function() {
  const markets = selectLoginAccountPositionsMarkets(store.getState());

  return {
    markets
  };
}

export const selectLoginAccountPositionsMarkets = createSelector(
  selectMarkets,
  selectAccountPositionsState,
  (markets, positions) => {
    if (!markets || !positions || Object.keys(positions).length === 0) {
      return [];
    }
    return markets.filter(market => positions[market.id] != null);
  }
);

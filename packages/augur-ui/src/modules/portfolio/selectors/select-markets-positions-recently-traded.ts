import { createSelector } from "reselect";
import store from "appStore";
import { getLastTradeTimestamp } from "modules/portfolio/helpers/get-last-trade-timestamp";
import {
  selectMarketTradingHistoryState,
  selectAccountPositionsState,
} from "appStore/select-state";

export default function() {
  return marketsPositionsRecentlyTraded(store.getState());
}

export const marketsPositionsRecentlyTraded = createSelector(
  selectAccountPositionsState,
  selectMarketTradingHistoryState,
  (positions, marketTradeHistory) =>
    Object.keys(positions).reduce(
      (p, m) => ({ ...p, [m]: getLastTradeTimestamp(marketTradeHistory[m]) }),
      {},
    ),
);

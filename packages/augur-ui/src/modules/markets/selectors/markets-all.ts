import store from "store";
import { selectMarket } from "modules/markets/selectors/market";
import {
  selectMarketInfosState,
  selectMarketTradingHistoryState,
  selectCancelingOrdersState,
  selectPendingOrdersState,
  selectLoginAccountAddress,
  selectAccountPositionsState
} from "store/select-state";
import { createSelector } from "reselect";
import { MarketData } from "modules/types";

export default function() {
  return selectMarkets(store.getState());
}

export const selectMarkets = createSelector(
  selectMarketInfosState,
  selectMarketTradingHistoryState,
  selectCancelingOrdersState,
  selectLoginAccountAddress,
  selectPendingOrdersState,
  selectAccountPositionsState,
  (
    marketsData,
    marketPriceHistory,
    orderCancellation,
    accountAddress,
    pendingOrders,
    accountPositions
  ): Array<MarketData> => {
    if (!marketsData) return [];
    return Object.keys(marketsData).reduce((p, marketId) => {
      if (!marketId || !marketsData[marketId]) return p;
      return [...p, selectMarket(marketId)];
    }, []);
  }
);

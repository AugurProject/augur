import store from "src/store";
import { selectMarket } from "modules/markets/selectors/market";
import {
  selectMarketsDataState,
  selectOutcomesDataState,
  selectMarketTradingHistoryState,
  selectOrderBooksState,
  selectOrderCancellationState,
  selectPendingOrdersState,
  selectAccountShareBalance,
  selectLoginAccountAddress,
  selectAccountPositionsState
} from "src/select-state";
import { createSelector } from "reselect";

export default function() {
  return selectMarkets(store.getState());
}

export const selectMarkets = createSelector(
  selectMarketsDataState,
  selectMarketTradingHistoryState,
  selectOutcomesDataState,
  selectOrderBooksState,
  selectOrderCancellationState,
  selectLoginAccountAddress,
  selectAccountShareBalance,
  selectPendingOrdersState,
  selectAccountPositionsState,
  (
    marketsData,
    marketPriceHistory,
    marketOutcomesData,
    orderBooks,
    orderCancellation,
    accountAddress,
    accountShareBalances,
    pendingOrders,
    accountPositions
  ) => {
    if (!marketsData) return [];
    return Object.keys(marketsData).map(marketId => {
      if (!marketId || !marketsData[marketId]) return {};
      return selectMarket(marketId);
    });
  }
);

import store from "store";
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
} from "store/select-state";
import { createSelector } from "reselect";
import { MarketData } from "modules/types";

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
  ): Array<MarketData> => {
    if (!marketsData) return [];
    return Object.keys(marketsData).reduce((p, marketId) => {
      if (!marketId || !marketsData[marketId]) return p;
      return [...p, selectMarket(marketId)];
    }, []);
  }
);

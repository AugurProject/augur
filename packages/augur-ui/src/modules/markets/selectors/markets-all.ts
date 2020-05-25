import store from "appStore";
import { selectMarket } from "modules/markets/selectors/market";
import {
  selectMarketTradingHistoryState,
  selectCancelingOrdersState,
  selectLoginAccountAddress,
  selectAccountPositionsState
} from "appStore/select-state";
import { createSelector } from "reselect";
import { MarketData } from "modules/types";
import { Markets } from "../store/markets";

export default function() {
  return selectMarkets(store.getState());
}

export const getMarkets = () => {
  const { marketInfos } = Markets.get();
  if (!marketInfos) return [];
  return Object.keys(marketInfos).reduce((p, marketId) => {
    if (!marketId || !marketInfos[marketId]) return p;
    return [...p, selectMarket(marketId)];
  }, []);
};

export const selectMarkets = createSelector(
  selectMarketTradingHistoryState,
  selectCancelingOrdersState,
  selectLoginAccountAddress,
  selectAccountPositionsState,
  (
    marketPriceHistory,
    orderCancellation,
    accountAddress,
    accountPositions
  ): Array<MarketData> => {
    const { marketInfos } = Markets.get();
    if (!marketInfos) return [];
    return Object.keys(marketInfos).reduce((p, marketId) => {
      if (!marketId || !marketInfos[marketId]) return p;
      return [...p, selectMarket(marketId)];
    }, []);
  }
);

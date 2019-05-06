import { createSelector } from "reselect";
import {
  selectLoginAccountAddress,
  selectMarketTradingHistoryState
} from "src/select-state";
import selectAllMarkets from "modules/markets/selectors/markets-all";
import { getLastTradeTimestamp } from "modules/portfolio/helpers/get-last-trade-timestamp";

export const selectAuthorOwnedMarkets = createSelector(
  selectAllMarkets,
  selectMarketTradingHistoryState,
  selectLoginAccountAddress,
  (allMarkets, marketTradingHistory, authorId) => {
    if (!allMarkets || !authorId) return null;
    const filteredMarkets = allMarkets.filter(
      market => market.author === authorId
    );
    return filteredMarkets.map(m => ({
      ...m,
      recentlyTraded: getLastTradeTimestamp(marketTradingHistory[m.id])
    }));
  }
);

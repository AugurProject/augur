import { createSelector } from "reselect";
import {
  selectLoginAccountAddress,
  selectMarketTradingHistoryState,
  selectPendingQueue,
  selectCurrentTimestamp
} from "store/select-state";
import { CREATE_MARKET } from 'modules/common/constants';
import selectAllMarkets from "modules/markets/selectors/markets-all";
import { getLastTradeTimestamp } from "modules/portfolio/helpers/get-last-trade-timestamp";
import { isSameAddress } from "utils/isSameAddress";

export const selectAuthorOwnedMarkets = createSelector(
  selectAllMarkets,
  selectPendingQueue,
  selectMarketTradingHistoryState,
  selectLoginAccountAddress,
  (allMarkets, pendingQueue, marketTradingHistory, authorId) => {
    if (!allMarkets || !authorId) return null;
    let filteredMarkets = allMarkets.filter(
      market => isSameAddress(market.author, authorId)
    );
    const pendingMarkets = Object.keys(pendingQueue[CREATE_MARKET] || {}).map(key => {
      let data = pendingQueue[CREATE_MARKET][key];
      console.log(data);
      data = Object.assign(data, data.data)
      console.log(data); 
      return data;
    });
    filteredMarkets = pendingMarkets.concat(filteredMarkets);
    return filteredMarkets.map(m => ({
      ...m,
      recentlyTraded: getLastTradeTimestamp(marketTradingHistory[m.id])
    }));
  }
);

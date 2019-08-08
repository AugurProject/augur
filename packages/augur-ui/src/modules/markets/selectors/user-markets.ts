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
import { formatDate } from "utils/format-date";

export const selectAuthorOwnedMarkets = createSelector(
  selectAllMarkets,
  selectPendingQueue,
  selectMarketTradingHistoryState,
  selectLoginAccountAddress,
  selectCurrentTimestamp,
  (allMarkets, pendingQueue, marketTradingHistory, authorId, currentTimestamp) => {
    if (!allMarkets || !authorId) return null;
    let filteredMarkets = allMarkets.filter(
      market => isSameAddress(market.author, authorId)
    );
    const pendingMarkets = Object.keys(pendingQueue[CREATE_MARKET] || {}).map(key => {
      let data = pendingQueue[CREATE_MARKET][key];
      const extraInfo = JSON.parse(data.info._extraInfo);
      data.id = key;
      data.description = extraInfo.description;
      data.pending = true;
      data.endTime = formatDate(data.info.endTime);
      data.recentlyTraded = formatDate(currentTimestamp);
      data.creationTime = formatDate(currentTimestamp);
      return data;
    });
    filteredMarkets = filteredMarkets.concat(pendingMarkets);
    return filteredMarkets.map(m => ({
      ...m,
      recentlyTraded: getLastTradeTimestamp(marketTradingHistory[m.id])
    }));
  }
);

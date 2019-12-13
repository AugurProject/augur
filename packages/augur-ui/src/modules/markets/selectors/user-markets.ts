import { createSelector } from "reselect";
import {
  selectLoginAccountAddress,
  selectMarketTradingHistoryState,
  selectPendingQueue,
  selectPendingLiquidityOrders
} from "store/select-state";
import { CREATE_MARKET } from 'modules/common/constants';
import selectAllMarkets from "modules/markets/selectors/markets-all";
import { getLastTradeTimestamp } from "modules/portfolio/helpers/get-last-trade-timestamp";
import { isSameAddress } from "utils/isSameAddress";
import { generateTxParameterId } from 'utils/generate-tx-parameter-id';

export const selectAuthorOwnedMarkets = createSelector(
  selectAllMarkets,
  selectPendingQueue,
  selectPendingLiquidityOrders,
  selectMarketTradingHistoryState,
  selectLoginAccountAddress,
  (allMarkets, pendingQueue, pendingLiquidityOrders, marketTradingHistory, authorId) => {
    if (!allMarkets || !authorId) return null;
    let filteredMarkets = allMarkets.filter(
      market => isSameAddress(market.author, authorId)
    );
    const pendingMarkets = Object.keys(pendingQueue[CREATE_MARKET] || {}).map(pendingId => {
      const pendingData = pendingQueue[CREATE_MARKET][pendingId];
      const data = Object.assign(pendingData, pendingData.data)
      data.id = pendingId;
      return data;
    });
    filteredMarkets = pendingMarkets.concat(filteredMarkets);
    return filteredMarkets.map(m => {
      const pendingTradedId = m.transactionHash || generateTxParameterId(m.txParams);
      const marketId = m.id || pendingTradedId;

      return {
        ...m,
        hasPendingLiquidityOrders: !!pendingLiquidityOrders[pendingTradedId],
        orderBook: pendingLiquidityOrders[marketId],
        recentlyTraded: getLastTradeTimestamp(marketTradingHistory[marketId])
      }
    });
  }
);

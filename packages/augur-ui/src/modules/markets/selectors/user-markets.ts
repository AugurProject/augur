import { createSelector } from "reselect";
import {
  selectLoginAccountAddress,
  selectMarketTradingHistoryState,
  selectPendingQueue,
  selectCurrentTimestamp,
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
    const pendingMarkets = Object.keys(pendingQueue[CREATE_MARKET] || {}).map(key => {
      let data = pendingQueue[CREATE_MARKET][key];
      data = Object.assign(data, data.data)
      return data;
    });
    filteredMarkets = pendingMarkets.concat(filteredMarkets);
    return filteredMarkets.map(m => {
      const pendingOrderId = m.pending && generateTxParameterId(m.txParams);

      return {
        ...m,
        hasPendingLiquidityOrders: !!pendingLiquidityOrders[m.id],
        orderBook: pendingLiquidityOrders[m.id] || (pendingOrderId && pendingLiquidityOrders[pendingOrderId]),
        recentlyTraded: getLastTradeTimestamp(marketTradingHistory[m.id])
      }
    });
  }
);

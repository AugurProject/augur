import { createSelector } from 'reselect';
import store from 'appStore';
import * as constants from 'modules/common/constants';
import {
  selectLoginAccountAddress,
  selectFilledOrders,
} from 'appStore/select-state';
import { selectMarket } from 'modules/markets/selectors/market';
import getUserFilledOrders from 'modules/orders/selectors/filled-orders';
import getUserOpenOrders from 'modules/orders/selectors/user-open-orders';
import getMarketsPositionsRecentlyTraded from 'modules/portfolio/selectors/select-markets-positions-recently-traded';

export default function() {
  return marketsFilledOrders(store.getState());
}

export const marketsFilledOrders = createSelector(
  selectLoginAccountAddress,
  selectFilledOrders,
  getMarketsPositionsRecentlyTraded,
  (loginAccountAddress, filledOrders, timestamps) => {
    const marketIds = filterMarketIds(
      filledOrders[loginAccountAddress] || [],
      [] // marketReportState.resolved
    );
    const markets = filterMarketsByStatus(marketIds, timestamps).sort(
      (a, b) => b.recentlyTraded.timestamp - a.recentlyTraded.timestamp
    );
    const allFilledOrders = getAllUserFilledOrders(marketIds);

    return {
      markets,
      marketsObj: keyObjectsById(markets),
      ordersObj: keyObjectsById(allFilledOrders),
      filledOrders: allFilledOrders,
    };
  }
);

const filterMarketIds = (userFilledOrders, resolvedMarkets) =>
  Object.keys(userFilledOrders).reduce(
    (p, m) => (resolvedMarkets.indexOf(m) === -1 ? [...p, m] : p),
    []
  );

const filterMarketsByStatus = (marketIds, marketsPositionsRecentlyTraded) =>
  marketIds.reduce((p, m) => {
    const market = selectMarket(m);
    if (!market) return [...p];
    if (
      Object.keys(market).length === 0 ||
      market.marketStatus === constants.MARKET_CLOSED
    ) {
      return p;
    }
    const filledOrders = getUserFilledOrders(m);
    if (filledOrders.length === 0) return p;

    return [
      ...p,
      {
        ...market,
        recentlyTraded: marketsPositionsRecentlyTraded[market.id] || 0,
        filledOrders,
        userOpenOrders: getUserOpenOrders(m),
      },
    ];
  }, []);

const getAllUserFilledOrders = marketIds =>
  marketIds.reduce(
    (p, marketId) => [...p, ...(getUserFilledOrders(marketId) || [])],
    []
  );

const keyObjectsById = array =>
  array.reduce((obj, o) => {
    obj[o.id] = o;
    return obj;
  }, {});

import { createSelector } from "reselect";
import store, { AppState } from "appStore";
import { selectMarkets } from "modules/markets/selectors/markets-all";
import getUserFilledOrders from "modules/orders/selectors/filled-orders";
import getUserOpenOrders from "modules/orders/selectors/user-open-orders";
import getMarketsPositionsRecentlyTraded from "modules/portfolio/selectors/select-markets-positions-recently-traded";
import { selectUserMarketOpenOrders } from "appStore/select-state";

export default function() {
  return marketsOpenOrders(store.getState() as AppState);
}

export const marketsOpenOrders = createSelector(selectMarkets, selectUserMarketOpenOrders, (allMarkets, openOrders) => {
  const markets = allMarkets.reduce((p, m) => {
    const userOpenOrders = getUserOpenOrders(m.id) || [];
    const marketsPositionsRecentlyTraded = getMarketsPositionsRecentlyTraded();
    if (userOpenOrders.length === 0) return p;
    return [
      ...p,
      {
        ...m,
        recentlyTraded: marketsPositionsRecentlyTraded[m.id] || 0,
        filledOrders: getUserFilledOrders(m.id) || [],
        userOpenOrders,
      },
    ];
  }, []);

  markets.sort(
    (a, b) => b.recentlyTraded.timestamp - a.recentlyTraded.timestamp,
  );

  const individualOrders = markets.reduce(
    (p, market) => [...p, ...getUserOpenOrders(market.id)],
    [],
  );

  const marketsObj = markets.reduce((obj, market) => {
    obj[market.id] = market;
    return obj;
  }, {});

  const ordersObj = individualOrders.reduce((obj, order) => {
    obj[order.id] = order;
    return obj;
  }, {});

  return {
    markets,
    marketsObj,
    ordersObj,
    openOrders: individualOrders,
  };
});

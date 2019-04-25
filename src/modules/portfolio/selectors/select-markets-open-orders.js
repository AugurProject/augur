import { createSelector } from "reselect";
import store from "src/store";
import getOpenOrders from "modules/orders/selectors/open-orders";
import * as constants from "src/modules/common-elements/constants";

export default function() {
  return marketsOpenOrders(store.getState());
}

export const marketsOpenOrders = createSelector(getOpenOrders, openOrders => {
  const markets = openOrders.filter(
    market => market.marketStatus !== constants.MARKET_CLOSED
  );

  const individualOrders = markets.reduce(
    (p, market) => [...p, ...market.userOpenOrders],
    []
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
    openOrders: individualOrders
  };
});

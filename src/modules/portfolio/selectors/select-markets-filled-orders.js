import { createSelector } from "reselect";
import store from "src/store";
import * as constants from "src/modules/common-elements/constants";
import {
  selectMarketReportState,
  selectLoginAccountAddress,
  selectFilledOrders
} from "src/select-state";
import { selectMarket } from "modules/markets/selectors/market";
import { keyArrayBy } from "utils/key-by";

export default function() {
  return marketsFilledOrders(store.getState());
}

export const marketsFilledOrders = createSelector(
  selectMarketReportState,
  selectLoginAccountAddress,
  selectFilledOrders,
  (marketReportState, loginAccountAddress, filledOrders) => {
    const marketIds = filterMarketIds(
      filledOrders[loginAccountAddress] || [],
      marketReportState.resolved
    );
    const markets = filterMarketsByStatus(marketIds);

    const allFilledOrders = marketIds.reduce(
      (p, marketId) => [...p, ...selectMarket(marketId).filledOrders],
      []
    );

    return {
      markets,
      marketsObj: keyObjectsById(markets),
      ordersObj: keyObjectsById(allFilledOrders),
      filledOrders: allFilledOrders
    };
  }
);

const filterMarketIds = (userFilledOrders, resolvedMarkets) =>
  Object.keys(
    keyArrayBy(
      userFilledOrders.reduce(
        (p, m) => (resolvedMarkets.indexOf(m.marketId) === -1 ? [...p, m] : p),
        []
      ),
      "marketId"
    )
  );

const filterMarketsByStatus = marketIds => {
  const mappedMarkets = marketIds.map(m => selectMarket(m)).map(item => {
    if (Object.keys(item).length === 0) return null;
    return item;
  });

  return mappedMarkets.filter(
    market => market && market.marketStatus !== constants.MARKET_CLOSED
  );
};

const keyObjectsById = array =>
  array.reduce((obj, o) => {
    obj[o.id] = o;
    return obj;
  }, {});

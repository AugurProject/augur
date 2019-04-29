import { createSelector } from "reselect";
import store from "src/store";
import * as constants from "src/modules/common-elements/constants";
import {
  selectMarketReportState,
  selectLoginAccountAddress,
  selectFilledOrders,
  selectMarketsDataState
} from "src/select-state";
import { selectMarket } from "modules/markets/selectors/market";
import { keyArrayBy } from "utils/key-by";
import getUserFilledOrders from "modules/orders/selectors/filled-orders";
import getUserOpenOrders from "modules/orders/selectors/user-open-orders";
import getMarketsPositionsRecentlyTraded from "modules/portfolio/selectors/select-markets-positions-recently-traded";

export default function() {
  return marketsFilledOrders(store.getState());
}

export const marketsFilledOrders = createSelector(
  selectMarketReportState,
  selectLoginAccountAddress,
  selectFilledOrders,
  selectMarketsDataState,
  getMarketsPositionsRecentlyTraded,
  (marketReportState, loginAccountAddress, filledOrders, marketsData, timestamps) => {
    const marketIds = filterMarketIds(
      filledOrders[loginAccountAddress] || [],
      marketReportState.resolved
    );
    const markets = filterMarketsByStatus(marketIds, timestamps).sort((a, b) => b.recentlyTraded.timestamp - a.recentlyTraded.timestamp);
    const allFilledOrders = getAllUserFilledOrders(marketIds);

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

const filterMarketsByStatus = (marketIds, marketsPositionsRecentlyTraded) =>
  marketIds.reduce((p, m) => {
    const market = selectMarket(m);
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
        userOpenOrders: getUserOpenOrders(m)
      }
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

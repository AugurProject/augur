import { createSelector } from "reselect";
import store from "src/store";
import selectAllMarkets from "modules/markets/selectors/markets-all";

export default function() {
  return selectOpenOrdersMarkets(store.getState());
}

export const selectOpenOrdersMarkets = createSelector(
  selectAllMarkets,
  markets =>
    markets.filter(
      market => market.userOpenOrders && market.userOpenOrders.length
    )
);

import store from "src/store";
import { selectMarket } from "modules/markets/selectors/market";

export default function() {
  return selectMarkets(store.getState());
}

export const selectMarkets = state => {
  const { marketsData } = state;
  if (!marketsData) return [];
  return Object.keys(marketsData).map(marketId => {
    if (!marketId || !marketsData[marketId]) return {};
    return selectMarket(marketId);
  });
};

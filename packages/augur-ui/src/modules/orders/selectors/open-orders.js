import { createSelector } from "reselect";
import { selectMarkets } from "modules/markets/selectors/markets-all";

const selectOpenOrdersMarketsSelector = () =>
  createSelector(selectMarkets, markets => {
    const openOrdersMarkets = [];
    if (markets) {
      const numMarkets = markets.length;
      for (let i = 0; i < numMarkets; ++i) {
        if (hasOpenOrdersInMarket(markets[i])) {
          const market = sortOpenOrders(markets[i]);
          openOrdersMarkets.push(market);
        }
      }
    }
    return openOrdersMarkets;
  });

const hasOpenOrdersInMarket = market => {
  const numOutcomes = market.outcomes.length;
  for (let j = 0; j < numOutcomes; ++j) {
    const outcome = market.outcomes[j];
    if (outcome.userOpenOrders.length) {
      return true;
    }
  }
  return false;
};

export function sortOpenOrders(market) {
  if (!market) return market;
  const numOutcomes = market.outcomes.length;
  if (numOutcomes === 1) return market;
  const outcomes = market.outcomes.filter(
    outcome => outcome.userOpenOrders && outcome.userOpenOrders.length > 0
  );
  if (outcomes.length < 2) return market;

  market.outcomes = market.outcomes.sort(
    (o1, o2) => parseInt(o1.id, 10) - parseInt(o2.id, 10)
  );
  return market;
}

export const selectOpenOrdersMarkets = selectOpenOrdersMarketsSelector();

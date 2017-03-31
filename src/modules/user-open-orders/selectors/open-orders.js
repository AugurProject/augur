import { createSelector } from 'reselect';
import store from 'src/store';
import { selectMarkets } from '../../markets/selectors/markets-all';

export default function () {
  // const { allMarkets } = require('../../../selectors');
  // return selectOpenOrdersMarkets(allMarkets);
  return selectOpenOrdersMarkets(store.getState());
}

export const selectOpenOrdersMarkets = createSelector(
  selectMarkets,
  (markets) => {
    const openOrdersMarkets = [];
    if (markets) {
      const numMarkets = markets.length;
      for (let i = 0; i < numMarkets; ++i) {
        if (hasOpenOrdersInMarket(markets[i])) openOrdersMarkets.push(markets[i]);
      }
    }
    return openOrdersMarkets;
  }
);

const hasOpenOrdersInMarket = (market) => {
  const numOutcomes = market.outcomes.length;
  for (let j = 0; j < numOutcomes; ++j) {
    const outcome = market.outcomes[j];
    if (outcome.userOpenOrders.length) {
      return true;
    }
  }
  return false;
};

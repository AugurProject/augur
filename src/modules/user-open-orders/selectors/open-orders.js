import memoize from 'memoizee';

export default function () {
  const { allMarkets } = require('../../../selectors');
  return selectOpenOrdersMarkets(allMarkets);
}

export const selectOpenOrdersMarkets = memoize((markets) => {
  const openOrdersMarkets = [];
  if (markets) {
    const numMarkets = markets.length;
    for (let i = 0; i < numMarkets; ++i) {
      if (hasOpenOrdersInMarket(markets[i])) openOrdersMarkets.push(markets[i]);
    }
  }
  return openOrdersMarkets;
}, { max: 1 });

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

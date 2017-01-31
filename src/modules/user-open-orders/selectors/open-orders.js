import memoizerific from 'memoizerific';

export default function () {
  const { allMarkets } = require('../../../selectors');
  return selectOpenOrdersMarkets(allMarkets);
}

export const selectOpenOrdersMarkets = memoizerific(1)((markets) => {
  const openOrdersMarkets = [];
  if (markets) {
    const numMarkets = markets.length;
    for (let i = 0; i < numMarkets; ++i) {
      if (hasOpenOrdersInMarket(markets[i])) openOrdersMarkets.push(markets[i]);
    }
  }
  return openOrdersMarkets;
});

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

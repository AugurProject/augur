import memoizerific from 'memoizerific';

export default function () {
  const { allMarkets } = require('../../../selectors');
  return selectFavoriteMarkets(allMarkets);
}

export const selectFavoriteMarkets = memoizerific(1)(markets =>
  markets.filter(market => !!market.isFavorite)
);

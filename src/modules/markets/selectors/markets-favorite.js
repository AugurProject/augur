import memoizerific from 'memoizerific';

export default function () {
	const { filteredMarkets } = require('../../../selectors');
	return selectFavoriteMarkets(filteredMarkets);
}

export const selectFavoriteMarkets = memoizerific(1)(markets =>
	markets.filter(market => !!market.isFavorite));

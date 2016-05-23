import memoizerific from 'memoizerific';

export const selectFavoriteMarkets = memoizerific(1)((markets) =>
	markets.filter(market => !!market.isFavorite));

export default function () {
	const { filteredMarkets } = require('../../../selectors');
	return selectFavoriteMarkets(filteredMarkets);
}

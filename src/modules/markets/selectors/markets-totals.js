import memoizerific from 'memoizerific';

export default function () {
	const { allMarkets, filteredMarkets, unpaginatedMarkets, favoriteMarkets } = require('../../../selectors');

	return selectMarketsTotals(
		allMarkets,
		filteredMarkets.length,
		unpaginatedMarkets.length,
		favoriteMarkets.length
	);
}

export const selectMarketsTotals = memoizerific(1)((allMarkets, filteredMarketsLength, unpaginatedMarketsLength, favoriteMarketsLength) => {
	const totals = allMarkets.reduce((p, market) => {
		p.numAll += 1;

		if (market.isPendingReport) {
			p.numPendingReports += 1;
		}

		return p;
	}, { numAll: 0, numFavorites: 0, numPendingReports: 0, numUnpaginated: 0, numFiltered: 0 });

	totals.numUnpaginated = unpaginatedMarketsLength;
	totals.numFiltered = filteredMarketsLength;
	totals.numFavorites = favoriteMarketsLength;

	return totals;
});

import memoizerific from 'memoizerific';
import { selectPositionsSummary } from '../../positions/selectors/positions-summary';

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
	const positions = { numPositions: 0, qtyShares: 0, totalValue: 0, totalCost: 0 };

	const totals = allMarkets.reduce((p, market) => {
			p.numAll++;

			if (market.isPendingReport) {
				p.numPendingReports++;
			}

			if (market.positionsSummary && market.positionsSummary.qtyShares && market.positionsSummary.qtyShares.value) {
				positions.numPositions += market.positionsSummary.numPositions.value;
				positions.qtyShares += market.positionsSummary.qtyShares.value;
				positions.totalValue += market.positionsSummary.totalValue.value || 0;
				positions.totalCost += market.positionsSummary.totalCost.value || 0;
			}

			return p;
		}, {
			numAll: 0,
			numFavorites: 0,
			numPendingReports: 0,
			numUnpaginated: 0,
			numFiltered: 0
		});

	totals.numUnpaginated = unpaginatedMarketsLength;
	totals.numFiltered = filteredMarketsLength;
	totals.numFavorites = favoriteMarketsLength;
	totals.positionsSummary = selectPositionsSummary(
		positions.numPositions,
		positions.qtyShares,
		positions.totalValue,
		positions.totalCost
	);

	return totals;
});

import memoizerific from 'memoizerific';

import { selectPositionsSummary } from '../../positions/selectors/positions-summary';

export default function() {
    var { allMarkets } = require('../../../selectors');
    return selectMarketsTotals(allMarkets);
}

export const selectMarketsTotals = memoizerific(1)((allMarkets) => {
	var positions = { numPositions: 0, qtyShares: 0, totalValue: 0, totalCost: 0 },
		totals;

	totals = allMarkets.reduce((p, market) => {
			p.numAll++;
			if (market.isFavorite) {
				p.numFavorites++;
			}
			if (market.isPendingReport) {
				p.numPendingReports++;
			}
			if (market.isFiltersMatch) {
				p.numFiltered++;
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
			numFiltered: 0
		});

	totals.positionsSummary = selectPositionsSummary(positions.numPositions, positions.qtyShares, positions.totalValue, positions.totalCost);

	return totals;
});

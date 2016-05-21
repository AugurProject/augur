import memoizerific from 'memoizerific';
import store from '../../../store';
import { selectUnpaginated, selectFavorites } from '../../markets/selectors/markets';
import { selectFilteredMarkets } from '../../markets/selectors/filtered-markets';
import { selectPositionsSummary } from '../../positions/selectors/positions-summary';

export const selectMarketsTotals = memoizerific(1)(
(allMarkets, activePage, selectedMarketsHeader, keywords, selectedFilters) => {
	const positions = { numPositions: 0, qtyShares: 0, totalValue: 0, totalCost: 0 };
	const filteredMarkets = selectFilteredMarkets(allMarkets, keywords, selectedFilters);

	const totals = allMarkets.reduce((p, market) => {
		p.numAll++;
		if (market.isPendingReport) {
			p.numPendingReports++;
		}

		if (market.positionsSummary && market.positionsSummary.qtyShares
			&& market.positionsSummary.qtyShares.value) {
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

	totals.numUnpaginated = selectUnpaginated(allMarkets, activePage,
	selectedMarketsHeader, keywords, selectedFilters).length;
	totals.numFiltered = filteredMarkets.length;
	totals.numFavorites = selectFavorites(filteredMarkets).length;
	totals.positionsSummary = selectPositionsSummary(positions.numPositions,
	positions.qtyShares, positions.totalValue, positions.totalCost);

	return totals;
});

export default function () {
	const { activePage, selectedMarketsHeader, keywords, selectedFilters } = store.getState();
	const	{ allMarkets } = require('../../../selectors');
	return selectMarketsTotals(
		allMarkets,
		activePage,
		selectedMarketsHeader,
		keywords,
		selectedFilters);
}

import memoizerific from 'memoizerific';

export default function () {
	const { allMarkets } = require('../../../selectors');
	return selectPositionsMarkets(allMarkets);
}

export const selectPositionsMarkets = memoizerific(1)((markets) => (
	(markets || []).filter(market => market.positionsSummary && market.positionsSummary.numPositions && market.positionsSummary.numPositions.value))
);

import memoizerific from 'memoizerific';

export default function () {
	const { allMarkets } = require('../../../selectors');
	return selectPositionsMarkets(allMarkets);
}

export const selectPositionsMarkets = memoizerific(1)(markets => (
	(markets || []).filter(market => market.myPositionsSummary && market.myPositionsSummary.numPositions && market.myPositionsSummary.numPositions.value))
);

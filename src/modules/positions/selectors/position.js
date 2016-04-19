import memoizerific from 'memoizerific';

import { selectPositionsSummary } from '../../positions/selectors/positions-summary';

export const selectPositionFromOutcomeAccountTrades = memoizerific(100)(function(outcomeAccountTrades, lastPrice) {
	var qtyShares = 0,
		totalValue = 0,
		totalCost = 0,
		position;

	if (!outcomeAccountTrades || !outcomeAccountTrades.length) {
		return null;
	}

	outcomeAccountTrades.forEach(outcomeAccountTrade => {
		qtyShares += outcomeAccountTrade.qtyShares;
		totalCost += outcomeAccountTrade.qtyShares * outcomeAccountTrade.purchasePrice;
		totalValue += outcomeAccountTrade.qtyShares * lastPrice;
	});

	position = selectPositionsSummary(outcomeAccountTrades.length, qtyShares, totalValue, totalCost);
	return position;
});


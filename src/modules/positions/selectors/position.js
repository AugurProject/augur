import memoizerific from 'memoizerific';
import { selectPositionsSummary } from '../../positions/selectors/positions-summary';

export const selectPositionFromOutcomeAccountTrades = memoizerific(100)((outcomeAccountTrades, lastPrice) => {
	let qtyShares = 0;
	let	totalValue = 0;
	let	totalCost = 0;

	if (!outcomeAccountTrades || !outcomeAccountTrades.length) {
		return null;
	}

	outcomeAccountTrades.forEach(outcomeAccountTrade => {
		qtyShares += outcomeAccountTrade.qtyShares;
		totalCost += outcomeAccountTrade.qtyShares * outcomeAccountTrade.purchasePrice;
		totalValue += outcomeAccountTrade.qtyShares * lastPrice;
	});

	const position = selectPositionsSummary(
		outcomeAccountTrades.length,
		qtyShares,
		totalValue,
		totalCost);

	return position;
});

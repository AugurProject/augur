import memoizerific from 'memoizerific';
import { formatEther, formatPercent, formatShares } from '../../../utils/format-number';

export default function() {
	var { positions } = require('../../../selectors');
	return selectPositionsSummary(positions);
}

export const selectPositionsSummary = memoizerific(20)(function(positions) {
	var totalValue = 0,
		totalCost = 0;

	if (!positions) {
		return {};
	}

	positions.forEach(position => {
		totalValue += position.totalValue.value || 0;
		totalCost += position.totalCost.value || 0;
	});

	return {
		numPositions: formatShares(positions.length),
		totalValue: formatEther(totalValue),
		totalCost: formatEther(totalCost),
		gainPercent: formatPercent((totalValue - totalCost) / totalCost * 100),
		netChange: formatEther(totalValue - totalCost)
	};
});
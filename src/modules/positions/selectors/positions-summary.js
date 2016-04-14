import memoizerific from 'memoizerific';
import { formatEther, formatPercent, formatNumber } from '../../../utils/format-number';

export default function() {
	var { positions } = require('../../../selectors');
	return selectPositionsSummary(positions);
}

export const selectPositionsSummary = memoizerific(20)(function(positions) {
	var totalValue = 0,
		totalCost = 0;

	positions = positions || [];

	positions.forEach(position => {
		totalValue += position.totalValue.value || 0;
		totalCost += position.totalCost.value || 0;
	});

	return {
		numPositions: formatNumber(positions.length, { decimals: 0, decimalsRounded: 0, denomination: 'Positions', omitSign: true, zero: true }),
		totalValue: formatEther(totalValue),
		totalCost: formatEther(totalCost),
		gainPercent: formatPercent(totalCost ? ((totalValue - totalCost) / totalCost * 100) : 0),
		netChange: formatEther(totalValue - totalCost)
	};
});
import memoizerific from 'memoizerific';
import { formatEther, formatPercent, formatShares, formatNumber } from '../../../utils/format-number';

export const selectPositionsSummary = memoizerific(20)(function(numPositions, qtyShares, totalValue, totalCost, positions) {
	var purchasePrice,
		valuePrice,
		shareChange,
		gainPercent,
		netChange;

	purchasePrice = qtyShares && totalCost / qtyShares || 0;
	valuePrice = qtyShares && totalValue / qtyShares || 0;
	shareChange = valuePrice - purchasePrice;
	gainPercent = totalCost && ((totalValue - totalCost) / totalCost * 100) || 0;
	netChange = totalValue - totalCost;

	return {
		numPositions: formatNumber(numPositions, { decimals: 0, decimalsRounded: 0, denomination: 'Positions', omitSign: true, zero: true }),
		qtyShares: formatShares(qtyShares),
		purchasePrice: formatEther(purchasePrice),
		totalValue: formatEther(totalValue),
		totalCost: formatEther(totalCost),
		shareChange: formatEther(shareChange),
		gainPercent: formatPercent(gainPercent),
		netChange: formatEther(netChange),
		positions
	};
});
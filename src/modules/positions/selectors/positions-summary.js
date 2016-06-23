import memoizerific from 'memoizerific';
import {
	formatEther,
	formatPercent,
	formatShares,
	formatNumber
} from '../../../utils/format-number';

export const selectPositionsSummary = memoizerific(20)((numPositions, qtyShares, totalValue, totalCost) => {
	const purchasePrice = qtyShares && totalCost / qtyShares || 0;
	const valuePrice = qtyShares && totalValue / qtyShares || 0;
	const shareChange = valuePrice - purchasePrice;
	const gainPercent = totalCost && ((totalValue - totalCost) / totalCost * 100) || 0;
	const netChange = totalValue - totalCost;

	return {
		numPositions: formatNumber(
			numPositions,
			{
				decimals: 0,
				decimalsRounded: 0,
				denomination: 'Positions',
				positiveSign: false,
				zeroStyled: false
			}
		),
		qtyShares: formatShares(qtyShares),
		purchasePrice: formatEther(purchasePrice),
		totalValue: formatEther(totalValue),
		totalCost: formatEther(totalCost),
		shareChange: formatEther(shareChange),
		gainPercent: formatPercent(gainPercent),
		netChange: formatEther(netChange)
	};
});

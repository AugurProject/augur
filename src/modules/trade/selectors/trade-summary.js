import memoizerific from 'memoizerific';
import { formatShares, formatEther } from '../../../utils/format-number';

export const selectTradeSummary = memoizerific(5)(function(tradeOrders) {
	var totals = { shares: 0, ether: 0, gas: 0 };

	(tradeOrders || []).forEach(tradeOrder => {
		totals.shares += (tradeOrder.shares && tradeOrder.shares.value) || 0;
		totals.ether += (tradeOrder.ether && tradeOrder.ether.value) || 0;
		totals.gas += (tradeOrder.gas && tradeOrder.gas.value) || 0;
	});

	return {
		totalShares: formatShares(totals.shares),
		totalEther: formatEther(totals.ether),
		totalGas: formatEther(totals.gas),
		tradeOrders
	};
});
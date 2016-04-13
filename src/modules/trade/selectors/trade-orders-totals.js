import memoizerific from 'memoizerific';
import { formatShares, formatEther } from '../../../utils/format-number';

export default function() {
	var { tradeOrders } = require('../../../selectors');
	return selectTradeOrdersTotals(tradeOrders);
}

export const selectTradeOrdersTotals = memoizerific(5)(function(tradeOrders) {
	var totals = { shares: 0, ether: 0, gas: 0 };

	tradeOrders.forEach(tradeOrder => {
		totals.shares += tradeOrder.shares && tradeOrder.shares.value || 0;
		totals.ether += tradeOrder.ether && tradeOrder.ether.value || 0;
		totals.gas += tradeOrder.gas && tradeOrder.gas.value || 0;
	});

	totals.shares = formatShares(totals.shares);
	totals.ether = formatEther(totals.ether);
	totals.gas = formatEther(totals.gas);

	return totals;
});
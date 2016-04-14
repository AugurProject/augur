import memoizerific from 'memoizerific';
import { formatEther, formatPercent, formatShares } from '../../../utils/format-number';

import store from '../../../store';

import { selectMarket } from '../../market/selectors/market';

export default function() {
	var { outcomes, accountTrades } = store.getState(),
		newPositions = [];

	// loop through each outcome of each market in account trades, and make a position
	Object.keys(accountTrades || {}).sort().forEach(marketID => Object.keys(accountTrades[marketID]).forEach((outcomeID, i, accountTradeKeys) => {
		newPositions.push(makePosition(
							selectMarket(marketID),
							outcomeID,
							outcomes[marketID] && outcomes[marketID][outcomeID],
							accountTrades[marketID][outcomeID],
							accountTradeKeys.length,
							i));
	}));

	newPositions.sort((a, b) => {
		if (a.marketID < b.marketID) {
			return -1;
		}
		else if (a.marketID > b.marketID) {
			return 1;
		}
		else {
			return b.totalValue.value - a.totalValue.value;
		}
	});

	return newPositions;
}

export const makePosition = memoizerific(100)(function(market, outcomeID, outcome, outcomeTrades, totalOutcomes, outcomeIndex) {
	var o = {
			...market,
			lastPrice: formatEther(0),
			qtyShares: formatShares(0),
			purchasePrice: formatEther(0),
			totalValue: formatEther(0),
			totalCost: formatEther(0),
			shareChange: formatShares(0),
			gainPercent: formatPercent(0),
			netChange: formatEther(0)
		};

	o.marketID = market.id;
	o.outcomeID = outcomeID;

	if (market && outcomeIndex <= 0) {
		o.description = market.description;
	}

	if (outcomeIndex <= 0) {
		o.rowspan = totalOutcomes;
	}

	if (outcome) {
		o.outcomeName = outcome.name;
		if (outcome.price) {
			o.lastPrice = formatEther(outcome.price);
		}
	}
	if (outcomeTrades && outcomeTrades.length) {
		o.qtyShares = 0;
		o.purchasePrice = 0;
		outcomeTrades.forEach(outcomeTrade => {
			o.qtyShares += outcomeTrade.qtyShares;
			o.purchasePrice += outcomeTrade.purchasePrice;
		});
		o.qtyShares = formatShares(o.qtyShares);
		o.purchasePrice = formatEther(o.purchasePrice / outcomeTrades.length);
	}

	o.totalValue = formatEther(o.qtyShares.value * o.lastPrice.value);
	o.totalCost = formatEther(o.qtyShares.value * o.purchasePrice.value);
	o.shareChange = formatEther(o.lastPrice.value - o.purchasePrice.value);
	if (o.totalCost.value) {
		o.gainPercent = formatPercent((o.totalValue.value - o.totalCost.value) / o.totalCost.value * 100);
	}
	else {
		o.gainPercent = formatPercent(0);
	}
	o.netChange = formatEther(o.totalValue.value - o.totalCost.value);

	return o;
});
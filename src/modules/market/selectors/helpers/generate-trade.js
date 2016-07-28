import memoizerific from 'memoizerific';
import { formatEther } from '../../../../utils/format-number';

import { BUY, SELL } from '../../../trade/constants/types';
import * as TRANSACTIONS_TYPES from '../../../transactions/constants/types';

import { updateTradesInProgress } from '../../../trade/actions/update-trades-in-progress';
import { makeTradeTransaction } from '../../../transactions/actions/add-trade-transaction';

import store from '../../../../store';

export const generateTrade = memoizerific(5)((market, outcome, outcomeTradeInProgress) => {
	const side = outcomeTradeInProgress && outcomeTradeInProgress.side || BUY;
	const numShares = outcomeTradeInProgress && outcomeTradeInProgress.numShares || 0;
	const limitPrice = outcomeTradeInProgress && outcomeTradeInProgress.limitPrice || (numShares ? 1 : 0);
	const totalFee = outcomeTradeInProgress && outcomeTradeInProgress.totalFee || 0;
	const totalCost = outcomeTradeInProgress && outcomeTradeInProgress.totalCost || 0;

	let trade = {
		side,
		numShares,
		limitPrice,

		totalFee: formatEther(totalFee),
		totalCost: formatEther(totalCost),

		tradeTypeOptions: [
			{ label: BUY, value: BUY },
			{ label: SELL, value: SELL }
		],

		tradeSummary: generateTradeSummary(generateTradeOrders(market, outcome, outcomeTradeInProgress)),
		updateTradeOrder: (shares, limitPrice, side) => store.dispatch(updateTradesInProgress(market.id, outcome.id, side, shares, limitPrice))
	};

	return trade;
});

export const generateTradeSummary = memoizerific(5)((tradeOrders) => {
	let tradeSummary = { totalGas: 0, tradeOrders: [] };

	if (tradeOrders && tradeOrders.length) {
		tradeSummary = tradeOrders.reduce((p, tradeOrder) => {

			// total gas
			p.totalGas += tradeOrder.gasEth && tradeOrder.gasEth.value || 0;

			// trade order
			p.tradeOrders.push(tradeOrder);

			return p;

		}, tradeSummary);
	}

	tradeSummary.totalGas = formatEther(tradeSummary.totalGas);

	return tradeSummary;
});

export const generateTradeOrders = memoizerific(5)((market, outcome, outcomeTradeInProgress) => {
	const tradeActions = outcomeTradeInProgress && outcomeTradeInProgress.tradeActions;

	if (!market || !outcome || !outcomeTradeInProgress || !tradeActions || !tradeActions.length) {
		return [];
	}

	let customOutcomeInProgress;

	return tradeActions.map(tradeAction => {
		customOutcomeInProgress = {
			numShares: parseFloat(tradeAction.shares),
			limitPrice: parseFloat(tradeAction.avgPrice),
			totalCost: parseFloat(tradeAction.costEth)
		};
		return makeTradeTransaction(
			TRANSACTIONS_TYPES[tradeAction.action],
			market.id,
			outcome.id,
			market.description,
			outcome.name,
			customOutcomeInProgress,
			store.dispatch)
	});
});

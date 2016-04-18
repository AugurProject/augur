import memoizerific from 'memoizerific';
import { formatShares, formatEther, formatNumber } from '../../../utils/format-number';

import { BUY_SHARES, SELL_SHARES, BID_SHARES, ASK_SHARES } from '../../transactions/constants/types';

import store from '../../../store';

import * as TradeActions from '../../trade/actions/trade-actions';

//import { selectOutcomeBids, selectOutcomeAsks } from '../../bids-asks/selectors/select-bids-asks';
import { selectNewTransaction } from '../../transactions/selectors/transactions';

export const selectTradeOrders = function(market, marketTradeInProgress, dispatch) {
	var orders = [];

	if (!market || !marketTradeInProgress || !market.outcomes.length) {
		return orders;
	}

	market.outcomes.forEach(outcome => {
		orders.concat(selectOutcomeTradeOrders(market, outcome, marketTradeInProgress[outcome.id], dispatch));
	});

	return orders;

/* for limit-based system
	market.outcomes.forEach(outcome => {
		if (!tradeInProgress[outcome.id] || !tradeInProgress[outcome.id].numShares) {
			return;
		}

		orders = orders.concat(selectOutcomeTransactions(
			market,
			outcome,
			tradeInProgress[outcome.id].numShares,
			tradeInProgress[outcome.id].limitPrice,
			selectOutcomeBids(marketID, outcome.id, bidsAsks),
			selectOutcomeAsks(marketID, outcome.id, bidsAsks),
			dispatch
		));
	});
*/
};

export const selectOutcomeTradeOrders = function(market, outcome, outcomeTradeInProgress, dispatch) {
	var orders = [];

	if (!outcomeTradeInProgress || !outcomeTradeInProgress.numShares) {
		return orders;
	}

	var numShares = outcomeTradeInProgress.numShares,
		totalCost = outcomeTradeInProgress.totalCost;

	orders.push(selectNewTransaction(
		numShares > 0 ? BUY_SHARES : SELL_SHARES,
		-0.3,
		numShares,
		totalCost,
		0,
		{
			marketID: market.id,
			outcomeID: outcome.id,
			marketDescription: market.description,
			outcomeName: outcome.name.toUpperCase(),
			avgPrice: formatEther(totalCost / numShares),
			feeToPay: formatEther(0.9)
		},
		(transactionID) => dispatch(TradeActions.tradeShares(transactionID, market.id, outcome.id, numShares, null, null))
	));

	return orders;
};

export const selectOutcomeTransactions = memoizerific(5)(function(market, outcome, numShares, limitPrice, outcomeBids, outcomeAsks, dispatch) {
	var isSell = numShares < 0,
		outcomeBidsOrAsks = !isSell ? outcomeAsks : outcomeBids,
		o = {
			shares: 0,
			ether: 0,
			ordersToTrade: [],
			feeToPay: 0,
			sharesRemaining: Math.abs(numShares) || 0
		},
		sharesToTrade = 0,
		orders = [];

	if (!outcomeBidsOrAsks || !outcomeBidsOrAsks.some) {
		return orders;
	}

	outcomeBidsOrAsks.some(outcomeBidOrAsk => {
		if (o.sharesRemaining <= 0) {
			return true;
		}

		sharesToTrade = outcomeBidOrAsk.numShares - Math.max(0, outcomeBidOrAsk.numShares - o.sharesRemaining);

		if (!isSell) {
			if (!limitPrice || outcomeBidOrAsk.price <= limitPrice) {
				o.shares += sharesToTrade;
				o.feeToPay -= sharesToTrade * outcomeBidOrAsk.price * market.tradingFee;
				o.ether -= sharesToTrade * outcomeBidOrAsk.price;
				o.ordersToTrade.push({ bidAsk: outcomeBidOrAsk, numShares: sharesToTrade });
				o.sharesRemaining -= sharesToTrade;
			}
		}
		else {
			if (!limitPrice || outcomeBidOrAsk.price >= limitPrice) {
				o.shares -= sharesToTrade;
				o.feeToPay -= sharesToTrade * outcomeBidOrAsk.price * market.tradingFee;
				o.ether += sharesToTrade * outcomeBidOrAsk.price;
				o.ordersToTrade.push({ bidAsk: outcomeBidOrAsk, numShares: sharesToTrade });
				o.sharesRemaining -= sharesToTrade;
			}
		}
	});

	if (o.ordersToTrade.length) {
		orders.push(selectNewTransaction(
			!isSell ? BUY_SHARES : SELL_SHARES,
			o.ordersToTrade.length * -0.1,
			o.shares,
			o.ether + o.feeToPay,
			0,
			{
				marketID: market.id,
				outcomeID: outcome.id,
				marketDescription: market.description,
				outcomeName: outcome.name.toUpperCase(),
				avgPrice: formatEther(Math.abs(o.ether / o.shares)),
				feeToPay: formatEther(o.feeToPay)
			},
			(transactionID) => dispatch(TradeActions.tradeShares(transactionID, market.id, outcome.id, o.shares, limitPrice, null))
		));
	}

	if (o.sharesRemaining && limitPrice) {
		o.ether = !isSell ? 0 - (o.sharesRemaining * limitPrice) : o.sharesRemaining * limitPrice;
		o.shares = !isSell ? o.sharesRemaining : 0 - o.sharesRemaining;
		orders.push(selectNewTransaction(
			!isSell ? BID_SHARES : ASK_SHARES,
			-0.1,
			o.shares,
			o.ether,
			0,
			{
				marketID: market.id,
				outcomeID: outcome.id,
				marketDescription: market.description,
				outcomeName: outcome.name.toUpperCase(),
				avgPrice: formatEther(limitPrice),
				feeToPay: formatNumber(0, { zero: true }) // no fee for market-making
			},
			(transactionID) => dispatch(TradeActions.tradeShares(transactionID, market.id, outcome.id, o.sharesRemaining, limitPrice, null))
		));
	}

	return orders;
});
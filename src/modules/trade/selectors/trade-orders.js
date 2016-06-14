// import memoizerific from 'memoizerific';
import {
	formatShares,
	formatEther,
	// formatNumber
} from '../../../utils/format-number';
// import store from '../../../store';
// import {
// 	selectOutcomeBids,
// 	selectOutcomeAsks
// } from '../../bids-asks/selectors/select-bids-asks';
import { makeTradeTransaction } from '../../transactions/actions/add-trade-transaction';
import { ASK } from '../../bids-asks/constants/bids-asks-types';

export const selectOutcomeTradeOrders =
(market, outcome, outcomeTradeInProgress, dispatch) => {
	const orders = [];

	if (!outcomeTradeInProgress || !outcomeTradeInProgress.numShares) {
		return orders;
	}

	const numShares = outcomeTradeInProgress.numShares;
	const	totalCost = outcomeTradeInProgress.totalCost;
	const	tradeTransaction = makeTradeTransaction(
			outcomeTradeInProgress.side === ASK,
			market,
			outcome,
			Math.abs(numShares),
			outcomeTradeInProgress.limitPrice,
			totalCost,
			0,
			0,
			dispatch
		);


	tradeTransaction.gas = formatEther(tradeTransaction.gas);
	tradeTransaction.ether = formatEther(tradeTransaction.ether);
	tradeTransaction.shares = formatShares(tradeTransaction.shares);

	orders.push(tradeTransaction);

	return orders;
};


export const selectTradeOrders = (market, marketTradeInProgress, dispatch) => {
	const orders = [];

	if (!market || !marketTradeInProgress || !market.outcomes.length) {
		return orders;
	}

	market.outcomes.forEach(outcome => {
		orders.concat(
			selectOutcomeTradeOrders(
					market, outcome,
					marketTradeInProgress[outcome.id], dispatch));
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
/*
export const selectOutcomeTransactions = memoizerific(5)(
function(market, outcome, numShares, limitPrice, outcomeBids, outcomeAsks, dispatch) {
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

		sharesToTrade = outcomeBidOrAsk.numShares - Math.max(
			0,
			outcomeBidOrAsk.numShares - o.sharesRemaining);

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
			(transactionID) => dispatch(trade(
				transactionID, market.id,
				outcome.id, o.shares,
				limitPrice, null))
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
				feeToPay: formatNumber(0, { zeroStyled: false }) // no fee for market-making
			},
			(transactionID) => dispatch(trade(
				transactionID, market.id, outcome.id,
				o.sharesRemaining, limitPrice, null))
		));
	}

	return orders;
});
*/

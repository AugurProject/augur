import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';
import {
	// PENDING,
	// SUCCESS,
	FAILED
} from '../../transactions/constants/statuses';
import { addTransactions } from '../../transactions/actions/add-transactions';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';
import { loadAccountTrades } from '../../positions/actions/load-account-trades';
import { selectMarket } from '../../market/selectors/market';
import { selectTransactionsLink } from '../../link/selectors/links';

export function placeTrade(marketID) {
	return (dispatch, getState) => {
		const market = selectMarket(marketID);

		dispatch(addTransactions(market.tradeSummary.tradeOrders));

		dispatch(multiTrade(marketID));

		dispatch(clearTradeInProgress(marketID));

		selectTransactionsLink(dispatch).onClick();
	};
}

/**
 * 
 * @param {String} marketID
 */
export function multiTrade(marketID) {
	return (dispatch, getState) => {
		const market = selectMarket(marketID);

		const marketOrderBook = getState().marketOrderBooks[marketID];

		const tradeOrders = market.tradeSummary.tradeOrders;

		const positionPerOutcome = market.positionOutcomes.reduce((outcomePositions, outcome) => {
			outcomePositions[outcome.id] = outcome.position;
			return outcomePositions;
		}, {});

		AugurJS.trade(
			marketID, marketOrderBook, tradeOrders, positionPerOutcome,
			function onTradeHash(transactionID, res) {
				console.log("onTradeHash %o", res);
				updateExistingTransaction(transactionID, { status: res.status });
			},
			function onCommitSent(transactionID, res) {
				console.log("onCommitSent %o", res);
				updateExistingTransaction(transactionID, { status: res.status });
			},
			function onCommitSuccess(transactionID, res) {
				console.log("onCommitSuccess %o", res);
				updateExistingTransaction(transactionID, { status: res.status });
			},
			function onCommitFailed(transactionID, res) {
				console.log("onCommitFailed %o", res);
				updateExistingTransaction(transactionID, { status: res.status });
			},
			function onNextBlock(transactionID, res) {
				console.log("onNextBlock %o", res);
				updateExistingTransaction(transactionID, { status: res.status });
			},
			function onTradeSent(transactionID, res) {
				console.log("onTradeSent %o", res);
				updateExistingTransaction(transactionID, { status: res.status });
			},
			function onTradeSuccess(transactionID, res) {
				console.log("onTradeSuccess %o", res);
				updateExistingTransaction(transactionID, { status: res.status });
			},
			function onTradeFailed(transactionID, res) {
				console.log("onTradeFailed %o", res);
				updateExistingTransaction(transactionID, { status: res.status });
			},
			function onBuySellSent(transactionID, res) {
				console.log("onBuySellSent %o", res);
				updateExistingTransaction(transactionID, { status: res.status });
			},
			function onBuySellSuccess(transactionID, res) {
				console.log("onBuySellSuccess %o", res);
				updateExistingTransaction(transactionID, { status: res.status });
			},
			function onBuySellFailed(transactionID, res) {
				console.log("onBuySellFailed %o", res);
				updateExistingTransaction(transactionID, { status: res.status });
			},
			function onShortSellSent(transactionID, res) {
				console.log("onShortSellSent %o", res);
				updateExistingTransaction(transactionID, { status: res.status });
			},
			function onShortSellSuccess(transactionID, res) {
				console.log("onShortSellSuccess %o", res);
				updateExistingTransaction(transactionID, { status: res.status });
			},
			function onShortSellFailed(transactionID, res) {
				console.log("onShortSellFailed %o", res);
				updateExistingTransaction(transactionID, { status: res.status });
			}
		);
	};
}

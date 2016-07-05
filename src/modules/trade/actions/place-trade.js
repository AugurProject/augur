import * as AugurJS from '../../../services/augurjs';
import {
	BID
} from '../../transactions/constants/types';

import {
	TRADING,
	SUCCESS,
	FAILED
} from '../../transactions/constants/statuses';
import { addTransactions } from '../../transactions/actions/add-transactions';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';
import { selectMarket } from '../../market/selectors/market';
import { selectTransactionsLink } from '../../link/selectors/links';

export function placeTrade(marketID) {
	return (dispatch, getState) => {
		const market = selectMarket(marketID);

		dispatch(addTransactions(market.tradeSummary.tradeOrders));

		dispatch(clearTradeInProgress(marketID));

		selectTransactionsLink(dispatch).onClick();
	};
}

/**
 *
 * @param {Number} transactionID
 * @param {String} marketID
 * @param {String} outcomeID
 * @param {Object} order
 */
export function processOrder(transactionID, marketID, outcomeID, order) {
	return (dispatch, getState) => {
		const market = selectMarket(marketID);

		const marketOrderBook = getState().marketOrderBooks[marketID];

		const tradeOrders = market.tradeSummary.tradeOrders.map((tradeTransaction) =>
			({
				type: tradeTransaction.type === BID ? 'buy' : 'sell',
				outcomeID: tradeTransaction.data.outcomeID,
				limitPrice: tradeTransaction.limitPrice,
				etherToBuy: tradeTransaction.ether.value,
				sharesToSell: tradeTransaction.shares.value
			})
		);

		const positionPerOutcome = market.positionOutcomes.reduce((outcomePositions, outcome) => {
			outcomePositions[outcome.id] = outcome.position;
			return outcomePositions;
		}, {});

		dispatch(updateExistingTransaction(transactionID, { status: TRADING }));

		let scalarMinMax;
		if (market.type === 'scalar') {
			scalarMinMax = {
				minValue: market.minValue,
				maxValue: market.maxValue
			};
		}

		AugurJS.processOrder(
			transactionID, marketID, marketOrderBook, order, market.positionOutcomes[outcomeID], scalarMinMax,
			(transactionID, res) => {
				console.log('onTradeHash %o', res);
				let newTransactionData;
				if (res.error != null) {
					newTransactionData = {
						status: FAILED,
						message: res.message
					};
				} else {
					newTransactionData = {
						message: 'received trade hash'
					};
				}
				dispatch(updateExistingTransaction(transactionID, newTransactionData));
			},
			(transactionID, res) => {
				console.log('onCommitSent %o', res);

				dispatch(updateExistingTransaction(transactionID, { status: 'commit sent' }));
			},
			(transactionID, res) => {
				console.log('onCommitSuccess %o', res);
				dispatch(updateExistingTransaction(transactionID, { status: 'CommitSuccess' }));
			},
			(transactionID, res) => {
				console.log('onCommitFailed %o', res);
				dispatch(updateExistingTransaction(transactionID, { status: FAILED }));
			},
			(transactionID, res) => {
				console.log('onNextBlock %o', res);
				// dispatch(updateExistingTransaction(transactionID, { status: res.status });)
			},
			(transactionID, res) => {
				console.log('onTradeSent %o', res);
				dispatch(updateExistingTransaction(transactionID, { status: 'TradeSent' }));
			},
			(transactionID, res) => {
				console.log('onTradeSuccess %o', res);
				dispatch(updateExistingTransaction(transactionID, { status: SUCCESS }));
			},
			(transactionID, res) => {
				console.log('onTradeFailed %o', res);
				dispatch(updateExistingTransaction(transactionID, { status: FAILED }));
			},
			(transactionID, res) => {
				console.log('onBuySellSent %o', res);
				dispatch(updateExistingTransaction(transactionID, { status: 'BuySellSent' }));
			},
			(transactionID, res) => {
				console.log('onBuySellSuccess %o', res);
				dispatch(updateExistingTransaction(transactionID, { status: SUCCESS }));
			},
			(transactionID, res) => {
				console.log('onBuySellFailed %o', res);
				dispatch(updateExistingTransaction(transactionID, { status: FAILED }));
			},
			(transactionID, res) => {
				console.log('onShortSellSent %o', res);
				dispatch(updateExistingTransaction(transactionID, { status: 'ShortSellSent' }));
			},
			(transactionID, res) => {
				console.log('onShortSellSuccess %o', res);
				dispatch(updateExistingTransaction(transactionID, { status: SUCCESS }));
			},
			(transactionID, res) => {
				console.log('onShortSellFailed %o', res);
				dispatch(updateExistingTransaction(transactionID, { status: FAILED }));
			},
			(transactionID, res) => {
				console.log('onBuyCompleteSetsSent %o', res);
				dispatch(updateExistingTransaction(transactionID, { status: 'BuyCompleteSetsSent' }));
			},
			(transactionID, res) => {
				console.log('onBuyCompleteSetsSuccess %o', res);
				dispatch(updateExistingTransaction(transactionID, { status: SUCCESS }));
			},
			(transactionID, res) => {
				console.log('onBuyCompleteSetsFailed %o', res);
				dispatch(updateExistingTransaction(transactionID, { status: FAILED }));
			}
		);
	};
}

import * as AugurJS from '../../../services/augurjs';
import {
	BUY_SHARES
} from '../../transactions/constants/types';

import {
	PLACE_MULTI_TRADE,
	SUCCESS,
	FAILED
} from '../../transactions/constants/statuses';
import { addTransaction } from '../../transactions/actions/add-transactions';
import { makeMultiTradeTransaction } from '../../transactions/actions/add-trade-transaction';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';
// import { loadAccountTrades } from '../../positions/actions/load-account-trades';
import { selectMarket } from '../../market/selectors/market';
import { selectTransactionsLink } from '../../link/selectors/links';

export function placeTrade(marketID) {
	return (dispatch, getState) => {
		// const market = selectMarket(marketID);

		dispatch(addTransaction(makeMultiTradeTransaction(marketID, dispatch)));

		dispatch(clearTradeInProgress(marketID));

		selectTransactionsLink(dispatch).onClick();
	};
}

/**
 *
 * @param {Number} transactionID
 * @param {String} marketID
 */
export function multiTrade(transactionID, marketID) {
	return (dispatch, getState) => {
		let scalarMinMax;

		const market = selectMarket(marketID);

		const marketOrderBook = getState().marketOrderBooks[marketID];

		const tradeOrders = market.tradeSummary.tradeOrders.map((tradeTransaction) =>
			({
				type: tradeTransaction.type === BUY_SHARES ? 'buy' : 'sell',
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

		dispatch(updateExistingTransaction(transactionID, { status: PLACE_MULTI_TRADE }));

		if (market.type === 'scalar') {
			scalarMinMax = {
				minValue: market.minValue,
				maxValue: market.maxValue
			};
		}

		AugurJS.multiTrade(
			transactionID, marketID, marketOrderBook, tradeOrders, positionPerOutcome, scalarMinMax,
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

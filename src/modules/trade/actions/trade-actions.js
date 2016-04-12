import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';
import { PENDING, SUCCESS, FAILED } from '../../transactions/constants/statuses';

import * as TransactionsActions from '../../transactions/actions/transactions-actions';
import * as PositionsActions from '../../positions/actions/positions-actions';

export const UPDATE_BIDSASKS_DATA = 'UPDATE_BIDSASKS_DATA';
export const UPDATE_TRADE_IN_PROGRESS = 'UPDATE_TRADE_IN_PROGRESS';
export const CLEAR_TRADE_IN_PROGRESS = 'CLEAR_TRADE_IN_PROGRESS';

export function tradeShares(transactionID, marketID, outcomeID, numShares, limitPrice, cap) {
	return (dispatch, getState) => {
		dispatch(TransactionsActions.updateTransactions({
			[transactionID]: { status: 'sending...' }
		}));

		AugurJS.tradeShares(BRANCH_ID, marketID, outcomeID, numShares, null, null, (err, res) => {
			if (err) {
				dispatch(TransactionsActions.updateTransactions({
					[transactionID]: { status: FAILED, message: err && err.message }
				}));
				return;
			}

			dispatch(TransactionsActions.updateTransactions({
				[transactionID]: { status: res.status }
			}));

			if (res.status === SUCCESS) {
				dispatch(PositionsActions.loadAccountTrades());
			}
		});
	};
}

export function updateTradesInProgress(marketID, outcomeID, numShares, limitPrice) {
	return function(dispatch, getState) {
		var tradesInProgress = getState().tradesInProgress,
			simulation;

		if (tradesInProgress[marketID] &&
			tradesInProgress[marketID][outcomeID] &&
			tradesInProgress[marketID][outcomeID].numShares === numShares &&
			tradesInProgress[marketID][outcomeID].limitPrice === limitPrice) {
				return;
		}

		simulation = AugurJS.getSimulatedBuy(marketID, outcomeID, numShares);

		dispatch({ type: UPDATE_TRADE_IN_PROGRESS, data: {
			marketID,
			outcomeID,
			details: {
				numShares,
				limitPrice,
				totalCost: simulation[0],
				newPrice: simulation[1]
			}
		}});
	};
}

export function clearTradeInProgress(marketID) {
	return { type: CLEAR_TRADE_IN_PROGRESS, marketID };
}
import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';
import { PENDING, SUCCESS, FAILED } from '../../transactions/constants/statuses';

import { addTransactions } from '../../transactions/actions/add-transactions';
import { updateTransactions } from '../../transactions/actions/update-transactions';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';

import * as PositionsActions from '../../positions/actions/positions-actions';

import { selectMarket } from '../../market/selectors/market';
import { selectTransactionsLink } from '../../link/selectors/links';

export function placeTrade(marketID) {
	return (dispatch, getState) => {
		var market = selectMarket(marketID);
		dispatch(addTransactions(market.tradeSummary.tradeOrders));
		dispatch(clearTradeInProgress(marketID));
		selectTransactionsLink(dispatch).onClick();
	};
}

export function tradeShares(transactionID, marketID, outcomeID, numShares, limitPrice, cap) {
	return (dispatch, getState) => {
		dispatch(updateTransactions({
			[transactionID]: { status: 'sending...' }
		}));

		AugurJS.tradeShares(BRANCH_ID, marketID, outcomeID, numShares, null, null, (err, res) => {
			if (err) {
				dispatch(updateTransactions({
					[transactionID]: { status: FAILED, message: err && err.message }
				}));
				return;
			}

			dispatch(PositionsActions.loadAccountTrades());

			dispatch(updateTransactions({
				[transactionID]: { status: res.status }
			}));
		});
	};
}
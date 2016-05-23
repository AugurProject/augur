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
		dispatch(clearTradeInProgress(marketID));
		selectTransactionsLink(dispatch).onClick();
	};
}

export function tradeShares(transactionID, marketID, outcomeID, numShares, limitPrice, cap) {
	return (dispatch, getState) => {
		dispatch(updateExistingTransaction({
			[transactionID]: { status: 'sending...' }
		}));

		AugurJS.tradeShares(BRANCH_ID, marketID, outcomeID, numShares, null, null, (err, res) => {
			if (err) {
				dispatch(updateExistingTransaction({
					[transactionID]: { status: FAILED, message: err && err.message }
				}));
				return;
			}

			dispatch(loadAccountTrades());
			dispatch(updateExistingTransaction(transactionID, { status: res.status }));
		});
	};
}

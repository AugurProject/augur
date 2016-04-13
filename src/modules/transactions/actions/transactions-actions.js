export const UPDATE_TRANSACTIONS = 'UPDATE_TRANSACTIONS';

import { BUY_SHARES, SELL_SHARES, BID_SHARES, ASK_SHARES } from '../../transactions/constants/types';

import * as AuthActions from '../../auth/actions/auth-actions';

export function addTransactions(transactions) {
    return function(dispatch, getState) {
    	dispatch(updateTransactions(transactions.reduce((p, transaction) => {
		    p[Math.round(Date.now() + window.performance.now() * 1000)] = {
		        ...transaction
		    };
		    return p;
		}, {})));
    };
}

export function updateTransactions(transactions) {
    return function(dispatch, getState) {
	    dispatch({ type: UPDATE_TRANSACTIONS, data: transactions });
	    dispatch(processTransactions());
	    dispatch(AuthActions.updateAssets());
    };
}

export function processTransactions() {
	return function(dispatch, getState) {
		var { isTransactionsWorking, nextTransaction } = require('../../../selectors');

		// exit if a transaction is already processing
		if (isTransactionsWorking) {
		    return;
		}

        // exit if no transactions are pending
        if (!nextTransaction) {
            return;
        }

        // start transaction
        nextTransaction.action(nextTransaction.id);
	};
}
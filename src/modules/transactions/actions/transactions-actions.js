export const UPDATE_TRANSACTIONS = 'UPDATE_TRANSACTIONS';

import { PENDING, SUCCESS, FAILED } from '../../transactions/constants/statuses';

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
		var { transactions } = require('../../../selectors');
		transactions.forEach(transaction => transaction.status === PENDING && transaction.action(transaction.id));
	};
}
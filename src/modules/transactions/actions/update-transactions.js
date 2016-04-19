export const UPDATE_TRANSACTIONS = 'UPDATE_TRANSACTIONS';

import * as AuthActions from '../../auth/actions/auth-actions';

import { processTransactions } from '../../transactions/actions/process-transactions';

export function updateTransactions(transactions) {
    return function(dispatch, getState) {
	    dispatch({ type: UPDATE_TRANSACTIONS, data: transactions });
	    dispatch(processTransactions());
	    dispatch(AuthActions.updateAssets());
    };
}
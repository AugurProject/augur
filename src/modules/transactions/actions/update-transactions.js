export const UPDATE_TRANSACTIONS = 'UPDATE_TRANSACTIONS';

import { updateAssets } from '../../auth/actions/update-assets';
import { processTransactions } from '../../transactions/actions/process-transactions';

export function updateTransactions(transactions) {
    return function(dispatch, getState) {
	    dispatch({ type: UPDATE_TRANSACTIONS, data: transactions });
	    dispatch(processTransactions());
	    dispatch(updateAssets());
    };
}
import { updateTransactions } from '../../transactions/actions/update-transactions';

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
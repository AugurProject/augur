import { UPDATE_TRANSACTIONS } from '../../transactions/actions/update-transactions';
import { SHOW_LINK } from '../../link/actions/link-actions';
import { PATHS_AUTH } from '../../link/constants/paths';
import { LOGOUT } from '../../auth/constants/auth-types';

export default function(transactions = {}, action) {
    switch (action.type) {
        case SHOW_LINK:
        	if (PATHS_AUTH[action.parsedURL.pathArray[0]] === LOGOUT) {
        		return {};
        	}
            return transactions;

        case UPDATE_TRANSACTIONS:
            return Object.keys(action.data).reduce((p, transactionID) => {
                p[transactionID] = {
                    ...transactions[transactionID],
                    ...action.data[transactionID],
                    id: transactionID
                };
                return p;
            }, { ...transactions });

        default:
            return transactions;
    }
}
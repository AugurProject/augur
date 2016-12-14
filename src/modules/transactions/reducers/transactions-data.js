import { UPDATE_TRANSACTIONS_DATA } from '../../transactions/actions/update-transactions-data';
import { CLEAR_LOGIN_ACCOUNT } from '../../auth/actions/update-login-account';

export default function (transactionsData = {}, action) {
	switch (action.type) {
		case UPDATE_TRANSACTIONS_DATA:
			return Object.keys(action.transactionsData).reduce((p, transactionID) => {
				p[transactionID] = {
					...transactionsData[transactionID],
					...action.transactionsData[transactionID],
					id: transactionID
				};
				return p;
			}, { ...transactionsData });

		case CLEAR_LOGIN_ACCOUNT:
			return {};

		default:
			return transactionsData;
	}
}

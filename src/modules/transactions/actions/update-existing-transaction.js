import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';
import { updateAssets } from '../../auth/actions/update-assets';
import { formatDate } from '../../../utils/format-date';

export function updateExistingTransaction(transactionID, newTransactionData) {
	return (dispatch, getState) => {
		const { transactionsData } = getState();

		// if the transaction doesn't already exist, probably/perhaps because user
		// logged out while a transaction was running and it just completed now,
		// do not update, ignore it
		if (!transactionID || !newTransactionData || !transactionsData || !transactionsData[transactionID]) {
			return;
		}
		if (newTransactionData.timestamp) {
			newTransactionData.timestamp = formatDate(new Date(newTransactionData.timestamp * 1000));
		} else {
			newTransactionData.timestamp = formatDate(new Date());
		}
		if (newTransactionData.message) {
			// newTransactionData.disableAutoMessage = true;
		}

		dispatch(updateTransactionsData({ [transactionID]: newTransactionData }));
		dispatch(updateAssets());
	};
}

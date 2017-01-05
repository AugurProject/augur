import { formatRealEther } from '../../../utils/format-number';
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
		const updatedTransactionData = { ...newTransactionData };
		if (updatedTransactionData.timestamp) {
			updatedTransactionData.timestamp = formatDate(new Date(updatedTransactionData.timestamp * 1000));
		} else {
			updatedTransactionData.timestamp = formatDate(new Date());
		}
		if (typeof updatedTransactionData.gasFees === 'string') {
			updatedTransactionData.gasFees = formatRealEther(updatedTransactionData.gasFees);
		}
		if (typeof transactionsData[transactionID].gasFees === 'string') {
			updatedTransactionData.gasFees = formatRealEther(transactionsData[transactionID].gasFees);
		}

		dispatch(updateTransactionsData({ [transactionID]: updatedTransactionData }));
		dispatch(updateAssets());
	};
}

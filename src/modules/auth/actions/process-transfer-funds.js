import * as AugurJS from '../../../services/augurjs';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateAssets } from '../../auth/actions/update-assets';

export function processTransferFunds(transactionID, fromAddress, amount, toAddress) {
	return (dispatch, getState) => {
		dispatch(updateExistingTransaction(transactionID, { status: 'submitting...' }));

		AugurJS.transferFunds(toAddress, amount, fromAddress,
			(...args) => {
				dispatch(updateExistingTransaction(transactionID, { status: `processing transferring of ${amount}eth to ${toAddress}` }));
			},
			(...args) => {
				dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message: `Transfer of ${amount}eth to ${toAddress} Complete.` }));
				dispatch(updateAssets());
			},
			(failedTransaction) => {
				dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: failedTransaction.message }));
			},
			(...args) => {
				// confirmed, not sure if this is needed since Success should be fine...
			}
		);
	};
}

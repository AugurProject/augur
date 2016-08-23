import { augur } from '../../../services/augurjs';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateAssets } from '../../auth/actions/update-assets';

export function processTransferFunds(transactionID, fromAddress, amount, toAddress) {
	return (dispatch, getState) => {
		dispatch(updateExistingTransaction(transactionID, { status: `submitting a request to transfer ${amount} ETH to ${toAddress}...` }));

		augur.sendCashFrom(toAddress, amount, fromAddress,
			() => {
				dispatch(updateExistingTransaction(transactionID, { status: `processing transferring of ${amount} ETH to ${toAddress}` }));
			},
			() => {
				dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message: `Transfer of ${amount} ETH to ${toAddress} Complete.` }));
				dispatch(updateAssets());
			},
			(failedTransaction) => {
				dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: failedTransaction.message }));
			}
		);
	};
}

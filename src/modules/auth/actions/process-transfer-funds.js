import * as AugurJS from '../../../services/augurjs';
import { BRANCH_ID } from '../../app/constants/network';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateAssets } from '../../auth/actions/update-assets';

export function processTransferFunds(transactionID, fromAddress, amount, toAddress) {
	return (dispatch, getState) => {
		const env = { fundNewAccountFromAddress: { address: fromAddress, amount } };

		dispatch(updateExistingTransaction(transactionID, { status: 'submitting...' }));

		AugurJS.fundNewAccount(env, toAddress, BRANCH_ID,
			() => {
				dispatch(updateExistingTransaction(transactionID, { status: 'processing...' }));
			},
			() => {
				dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message: 'Loaded free ether and rep' }));
				dispatch(updateAssets());
			},
			(failedTransaction) => {
				dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: failedTransaction.message }));
			}
		);
	};
}

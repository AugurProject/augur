import * as AugurJS from '../../../services/augurjs';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateAssets } from '../../auth/actions/update-assets';

export function processFundNewAccount(transactionID, address) {
	return (dispatch, getState) => {
		const { env, branch } = getState();

		dispatch(updateExistingTransaction(transactionID, { status: 'submitting...' }));

		AugurJS.fundNewAccount(env, address, branch.id,
			(data) => {
				dispatch(updateExistingTransaction(transactionID, { status: 'processing...', hash: data.txHash }));
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

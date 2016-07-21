import * as AugurJS from '../../../services/augurjs';
import { BRANCH_ID } from '../../app/constants/network';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateAssets } from '../../auth/actions/update-assets';

export function fundNewAccount(transactionID, address) {
	return (dispatch, getState) => {
		const { env } = getState();

		AugurJS.fundNewAccount(env, address, BRANCH_ID, () => {
			dispatch(updateExistingTransaction(transactionID, { status: 'sent request', message: 'A request has been sent to fund your account.' }));
		},
		() => {
			dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, message: 'Your account has successfully been funded!' }));
			dispatch(updateAssets());
		},
		(failedTransaction) => {
			dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: failedTransaction.message }));
		});
	};
}

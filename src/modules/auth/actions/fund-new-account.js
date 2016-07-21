import * as AugurJS from '../../../services/augurjs';
import { BRANCH_ID } from '../../app/constants/network';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateAssets } from '../../auth/actions/update-assets';

export const fundNewAccount = (transactionID, address) =>
	(dispatch, getState) => {
		const { env } = getState();
		AugurJS.fundNewAccount(env, address, BRANCH_ID, (transaction) => {
			dispatch(updateExistingTransaction({ [transactionID]: { status: 'sending...' } }));
		},
		(succesfulTransaction) => {
			dispatch(updateExistingTransaction(transactionID, { status: SUCCESS }));
			dispatch(updateAssets());
		},
		(failedTransaction) => {
			dispatch(updateExistingTransaction(transactionID, { status: FAILED }));
		});
	};

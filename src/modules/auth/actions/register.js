import * as AugurJS from '../../../services/augurjs';
import { BRANCH_ID } from '../../app/constants/network';
import { LOGIN } from '../../auth/constants/auth-types';
import {
PASSWORDS_DO_NOT_MATCH,
USERNAME_REQUIRED
} from '../../auth/constants/form-errors';
// import { PENDING, SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { authError } from '../../auth/actions/auth-error';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { selectAuthLink } from '../../link/selectors/links';
// import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
// import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';
// import { makeTransactionID } from '../../transactions/actions/add-transactions';
import { updateAssets } from '../../auth/actions/update-assets';

export function register(name, password, password2) {
	return (dispatch, getState) => {
		// const transactionID = makeTransactionID();

		if (!name || !name.length) {
			return dispatch(authError({ code: USERNAME_REQUIRED }));
		}

		if (password !== password2) {
			return dispatch(authError({ code: PASSWORDS_DO_NOT_MATCH }));
		}

		const env = getState().env;

		AugurJS.register(env, BRANCH_ID, name, password, (err, loginAccount) => {
			if (err) {
				dispatch(authError(err));
				return;
			}
			dispatch(updateLoginAccount({ secureLoginID: loginAccount.secureLoginID }));
			selectAuthLink(LOGIN, false, dispatch).onClick();
		},
		(transaction) => {
			console.log(transaction);
			// dispatch(updateTransactionsData({ [transactionID]: { type: 'fund account', status: PENDING } }));
			console.log(getState().transactionsData);
		},
		(succesfulTransaction) => {
			console.log(succesfulTransaction);
			// dispatch(updateExistingTransaction(transactionID, { status: SUCCESS, type: 'fund account' }));
			console.log(getState().transactionsData);
			dispatch(updateAssets());
		},
		(failedTransaction) => {
			console.log(failedTransaction);
			// dispatch(updateExistingTransaction(transactionID, { status: FAILED, type: 'fund account' }));
			console.log(getState().transactionsData);
		}
		);
	};
}

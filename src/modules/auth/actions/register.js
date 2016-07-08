import * as AugurJS from '../../../services/augurjs';

import { REGISTER, NEW_REGISTER } from '../../auth/constants/auth-types';
import {
PASSWORDS_DO_NOT_MATCH,
USERNAME_REQUIRED
} from '../../auth/constants/form-errors';

import { SUCCESS, FAILED } from '../../transactions/constants/statuses';

import { updateAssets } from '../../auth/actions/update-assets';
import { authError } from '../../auth/actions/auth-error';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { makeTransactionID } from '../../transactions/actions/add-transactions';
import { selectAuthLink } from '../../link/selectors/links';

export function register(name, password, password2) {
	return (dispatch, getState) => {
		const { links } = require('../../../selectors');
		// const transactionID = makeTransactionID();
		// let numAssetsLoaded = -1;

		if (!name || !name.length) {
			return dispatch(authError({ code: USERNAME_REQUIRED }));
		}

		if (password !== password2) {
			return dispatch(authError({ code: PASSWORDS_DO_NOT_MATCH }));
		}
		//
		// function makeTransactionUpdate() {
		// 	const transactionObj = {};
		//
		// 	transactionObj.type = REGISTER;
		//
		// 	if (numAssetsLoaded < 3) {
		// 		transactionObj.status = 'loading ether & rep...';
		// 	} else {
		// 		transactionObj.status = SUCCESS;
		// 	}
		//
		// 	return transactionObj;
		// }

		AugurJS.register(name, password, (err, loginAccount) => {
			if (err) {
				// if (numAssetsLoaded === -1) {
				dispatch(authError(err));
				// }
				// else {
				// 	dispatch(updateExistingTransaction(
				// 		transactionID,
				// 		{ status: FAILED, message: err.message }));
				// }
				return;
			}
			console.log('past error', NEW_REGISTER);
			// numAssetsLoaded++;
			// links.marketsLink.onClick();
			// dispatch(updateTransactionsData({ [transactionID]: makeTransactionUpdate() }));
			dispatch(updateLoginAccount({ secureLoginID: loginAccount.secureLoginID}));
			selectAuthLink(NEW_REGISTER, false, dispatch).onClick();
			console.log('past select authLink');
		});
		// , () => {
		// 	numAssetsLoaded++;
		// 	dispatch(updateAssets());
		// 	dispatch(updateExistingTransaction(transactionID, makeTransactionUpdate()));
		// }
	};
}

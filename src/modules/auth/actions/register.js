import * as AugurJS from '../../../services/augurjs';

import { REGISTER } from '../../auth/constants/auth-types';
import { PASSWORDS_DO_NOT_MATCH, PASSWORD_TOO_SHORT, USERNAME_REQUIRED } from '../../auth/constants/form-errors';

import { PENDING, SUCCESS, FAILED } from '../../transactions/constants/statuses';

import { updateAssets } from '../../auth/actions/update-assets';
import { authError } from '../../auth/actions/auth-error';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { makeTransactionID } from '../../transactions/actions/add-transactions';

export function register(username, password, password2) {
	return (dispatch, getState) => {
		var { links } = require('../../../selectors'),
			transactionID = makeTransactionID(),
			numAssetsLoaded = -1;

		if (!username || !username.length) {
			return dispatch(authError({ code: USERNAME_REQUIRED }));
		}

		if (password !== password2) {
			return dispatch(authError({ code: PASSWORDS_DO_NOT_MATCH }));
		}

		AugurJS.register(username, password, true, (err, loginAccount) => {
			if (err) {
				if (numAssetsLoaded === -1) {
					dispatch(authError(err));
				}
				else {
					dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: err.message }));
				}
				return;
			}
			numAssetsLoaded++;
			links.marketsLink.onClick();
			dispatch(updateTransactionsData({ [transactionID]: makeTransactionUpdate() }));
			dispatch(updateLoginAccount(loginAccount));

		}, (res) => {
			numAssetsLoaded++;
			dispatch(updateAssets());
			dispatch(updateExistingTransaction(transactionID, makeTransactionUpdate()));
		});

		function makeTransactionUpdate() {
			var transactionObj = {};

			transactionObj.type = REGISTER;

			if (numAssetsLoaded < 3) {
				transactionObj.status = 'loading ether & rep...';
			}
			else {
				transactionObj.status = SUCCESS;
			}

			return transactionObj;
		}
	};
}
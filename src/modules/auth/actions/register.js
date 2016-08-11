import { augur } from '../../../services/augurjs';

import { LOGIN } from '../../auth/constants/auth-types';
import {
PASSWORDS_DO_NOT_MATCH,
USERNAME_REQUIRED
} from '../../auth/constants/form-errors';

import { authError } from '../../auth/actions/auth-error';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { selectAuthLink } from '../../link/selectors/links';
import { addFundNewAccount } from '../../transactions/actions/add-fund-new-account-transaction';

export function register(name, password, password2) {
	return (dispatch, getState) => {
		if (!name || !name.length) {
			return dispatch(authError({ code: USERNAME_REQUIRED }));
		}
		if (password !== password2) {
			return dispatch(authError({ code: PASSWORDS_DO_NOT_MATCH }));
		}
		augur.web.register(name, password, (account) => {
			if (!account) {
				return dispatch(authError({ code: 0, message: 'failed to register' }));
			} else if (account.error) {
				return dispatch(authError({ code: account.error, message: account.message }));
			}
			const loginAccount = { ...account, id: account.address };
			dispatch(updateLoginAccount({ secureLoginID: loginAccount.secureLoginID }));
			dispatch(addFundNewAccount(loginAccount.address));
			selectAuthLink(LOGIN, false, dispatch).onClick();
		});
	};
}

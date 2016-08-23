import { augur } from '../../../services/augurjs';

import { LOGIN } from '../../auth/constants/auth-types';
import {
PASSWORDS_DO_NOT_MATCH,
USERNAME_REQUIRED
} from '../../auth/constants/form-errors';
import {
	loadLoginAccountDependents,
	loadLoginAccountLocalStorage
} from '../../auth/actions/load-login-account';
import { authError } from '../../auth/actions/auth-error';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { selectAuthLink } from '../../link/selectors/links';
import { addFundNewAccount } from '../../transactions/actions/add-fund-new-account-transaction';

export function register(name, password, password2, rememberMe) {
	return (dispatch, getState) => {
		const { links } = require('../../../selectors');
		const localStorageRef = typeof window !== 'undefined' && window.localStorage;
		// if (!name || !name.length) {
		// 	return dispatch(authError({ code: USERNAME_REQUIRED }));
		// }
		if (password !== password2) {
			return dispatch(authError({ code: PASSWORDS_DO_NOT_MATCH }));
		}
		console.log('going to register on augur.web');
		augur.web.register(name, password, (account) => {
			if (!account) {
				return dispatch(authError({ code: 0, message: 'failed to register' }));
			} else if (account.error) {
				return dispatch(authError({ code: account.error, message: account.message }));
			}
			const loginAccount = { ...account, id: account.address };
			if (!loginAccount || !loginAccount.id) {
				return;
			}
			if (rememberMe && localStorageRef && localStorageRef.setItem) {
				const persistentAccount = Object.assign({}, loginAccount);
				if (Buffer.isBuffer(persistentAccount.privateKey)) {
					persistentAccount.privateKey = persistentAccount.privateKey.toString('hex');
				}
				if (Buffer.isBuffer(persistentAccount.derivedKey)) {
					persistentAccount.derivedKey = persistentAccount.derivedKey.toString('hex');
				}
				localStorageRef.setItem('account', JSON.stringify(persistentAccount));
			}
			// dispatch(updateLoginAccount({ secureLoginID: loginAccount.secureLoginID }));
			dispatch(addFundNewAccount(loginAccount.address));
			dispatch(loadLoginAccountLocalStorage(loginAccount.id));
			dispatch(updateLoginAccount(loginAccount));
			dispatch(loadLoginAccountDependents());
			if (links && links.marketsLink)	{
				return links.marketsLink.onClick(links.marketsLink.href);
			}
			// selectAuthLink(LOGIN, false, dispatch).onClick();
		});
	};
}

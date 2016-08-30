import { augur } from '../../../services/augurjs';
import {
PASSWORDS_DO_NOT_MATCH
} from '../../auth/constants/form-errors';
import {
	loadLoginAccountDependents,
	loadLoginAccountLocalStorage
} from '../../auth/actions/load-login-account';
import { authError } from '../../auth/actions/auth-error';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { addFundNewAccount } from '../../transactions/actions/add-fund-new-account-transaction';
import { validatePassword } from '../../auth/validators/password-validator';

export function register(name, password, password2, loginID, rememberMe, cb) {
	return (dispatch, getState) => {
		const { links } = require('../../../selectors');
		const localStorageRef = typeof window !== 'undefined' && window.localStorage;

		if (loginID && links && links.marketsLink && !cb)	{
			const { loginAccount } = getState();
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
			return links.marketsLink.onClick(links.marketsLink.href);
		}

		if (password !== password2) {
			return dispatch(authError({ code: PASSWORDS_DO_NOT_MATCH }));
		}

		const passCheck = validatePassword(password);

		if (!passCheck.valid) {
			return dispatch(authError({ ...passCheck }));
		}

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

			dispatch(addFundNewAccount(loginAccount.address));
			dispatch(loadLoginAccountLocalStorage(loginAccount.id));
			dispatch(updateLoginAccount(loginAccount));
			dispatch(loadLoginAccountDependents());

			if (typeof cb === 'function') {
				cb(loginAccount);
			}
		});

	};
}

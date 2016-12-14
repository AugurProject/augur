import { augur } from '../../../services/augurjs';
import {
PASSWORDS_DO_NOT_MATCH,
} from '../../auth/constants/form-errors';
import {
	loadLoginAccountDependents,
	loadLoginAccountLocalStorage
} from '../../auth/actions/load-login-account';
import { authError } from '../../auth/actions/auth-error';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { addFundNewAccount } from '../../transactions/actions/add-fund-new-account-transaction';
import isCurrentLoginMessageRead from '../../login-message/helpers/is-current-login-message-read';
import isUserLoggedIn from '../../auth/helpers/is-user-logged-in';
import { updateAccountSettings } from '../../auth/actions/update-account-settings';

export function register(name, password, password2, loginID, rememberMe, loginAccount, cb) {
	return (dispatch, getState) => {
		const { links } = require('../../../selectors');
		const localStorageRef = typeof window !== 'undefined' && window.localStorage;

		if (loginID && links && links.marketsLink && !cb && loginAccount.keystore)	{
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
			loginAccount.onUpdateAccountSettings = settings => dispatch(updateAccountSettings(settings));
			loginAccount.settings = loginAccount.settings || {};
			dispatch(loadLoginAccountLocalStorage(loginAccount.address));
			dispatch(updateLoginAccount(loginAccount));
			dispatch(loadLoginAccountDependents((err, ether) => {
				dispatch(addFundNewAccount(loginAccount.address));
			}));

			// decide if we need to display the loginMessage
			const { loginMessage } = getState();
			if (isUserLoggedIn(loginAccount) && !isCurrentLoginMessageRead(loginMessage)) {
				return links.loginMessageLink.onClick();
			}

			return links.marketsLink.onClick(links.marketsLink.href);
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
			const localLoginAccount = {
				...account,
				loginID: account.loginID || account.secureLoginID
			};
			if (!localLoginAccount || !localLoginAccount.address) {
				return;
			}
			dispatch(updateLoginAccount({ loginID: localLoginAccount.loginID }));
			// dispatch(addFundNewAccount(localLoginAccount.address));
			if (typeof cb === 'function') {
				cb(localLoginAccount);
			}
		});
	};
}

import { augur } from '../../../services/augurjs';
import {
	loadLoginAccountDependents,
	loadLoginAccountLocalStorage
} from '../../auth/actions/load-login-account';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { authError } from '../../auth/actions/auth-error';
import { addFundNewAccount } from '../../transactions/actions/add-fund-new-account-transaction';
import isCurrentLoginMessageRead from '../../login-message/helpers/is-current-login-message-read';
import { updateAccountSettings } from '../../auth/actions/update-account-settings';

export function login(secureLoginID, password, rememberMe) {
	return (dispatch, getState) => {
		const localStorageRef = typeof window !== 'undefined' && window.localStorage;
		augur.web.login(secureLoginID, password, (account) => {
			if (!account) {
				return dispatch(authError({ code: 0, message: 'failed to login' }));
			} else if (account.error) {
				return dispatch(authError({ code: account.error, message: account.message }));
			}
			const loginAccount = {
				...account,
				loginID: account.loginID || account.secureLoginID,
				settings: {},
				onUpdateAccountSettings: (settings) => dispatch(updateAccountSettings(settings))
			};
			if (!loginAccount || !loginAccount.address) {
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
			dispatch(loadLoginAccountLocalStorage(loginAccount.address));
			dispatch(updateLoginAccount(loginAccount));
			dispatch(loadLoginAccountDependents((err, balances) => {
				if (err || !balances) {
					return console.error('loadLoginAccountDependents:', err);
				}
				if (balances.ether === '0') {
					dispatch(addFundNewAccount(loginAccount.address));
				}
			}));

			// need to load selectors here as they get updated above
			const { links } = require('../../../selectors');
			if (isCurrentLoginMessageRead(getState().loginMessage)) {
				links.marketsLink.onClick(links.marketsLink.href);
			} else {
				links.loginMessageLink.onClick();
			}
		});
	};
}

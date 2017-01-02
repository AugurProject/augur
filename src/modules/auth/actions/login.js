import { abi, accounts, constants } from '../../../services/augurjs';
import {
	loadLoginAccountDependents,
	loadLoginAccountLocalStorage
} from '../../auth/actions/load-login-account';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { authError } from '../../auth/actions/auth-error';
import { updateAccountSettings } from '../../auth/actions/update-account-settings';
import { fundNewAccount } from '../../auth/actions/fund-new-account';
import isCurrentLoginMessageRead from '../../login-message/helpers/is-current-login-message-read';

export function login(loginID, password, rememberMe) {
	return (dispatch, getState) => {
		accounts.login(loginID, password, (account) => {
			if (!account) {
				return dispatch(authError({ code: 0, message: 'failed to login' }));
			} else if (account.error) {
				return dispatch(authError({ code: account.error, message: account.message }));
			}
			const loginAccount = {
				...account,
				settings: {},
				onUpdateAccountSettings: settings => dispatch(updateAccountSettings(settings))
			};
			if (loginAccount && loginAccount.address) {
				const localStorageRef = typeof window !== 'undefined' && window.localStorage;
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
					if (err || !balances) return console.error(err);
					if (!balances.ether || abi.bignum(balances.ether).eq(constants.ZERO)) {
						dispatch(fundNewAccount());
					}
				}));

				// need to load selectors here as they get updated above
				const { links } = require('../../../selectors');
				if (isCurrentLoginMessageRead(getState().loginMessage)) {
					links.marketsLink.onClick(links.marketsLink.href);
				} else {
					links.loginMessageLink.onClick();
				}
			}
		});
	};
}

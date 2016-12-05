import { augur } from '../../../services/augurjs';
import {
	loadLoginAccountDependents,
	loadLoginAccountLocalStorage
} from '../../auth/actions/load-login-account';
import { authError } from '../../auth/actions/auth-error';
import { updateLoginAccount } from '../../auth/actions/update-login-account';

export function importAccount(name, password, rememberMe, keystore) {
	return (dispatch, getState) => {
		const { links } = require('../../../selectors');
		const localStorageRef = typeof window !== 'undefined' && window.localStorage;
		try {
			augur.web.importAccount(name, password, keystore, (loginAccount) => {
				const importedAccount = {
					...loginAccount,
					loginID: loginAccount.loginID || loginAccount.secureLoginID
				};
				if (!importedAccount || !importedAccount.keystore) {
					return;
				}
				if (rememberMe && localStorageRef && localStorageRef.setItem) {
					const persistentAccount = Object.assign({}, importedAccount);
					if (Buffer.isBuffer(persistentAccount.privateKey)) {
						persistentAccount.privateKey = persistentAccount.privateKey.toString('hex');
					}
					localStorageRef.setItem('account', JSON.stringify(persistentAccount));
				}
				dispatch(loadLoginAccountLocalStorage(importedAccount.address));
				dispatch(updateLoginAccount(importedAccount));
				dispatch(loadLoginAccountDependents());
				if (links && links.marketsLink)	{
					return links.marketsLink.onClick(links.marketsLink.href);
				}
				return;
			});
		} catch (e) {
			console.error(e);
			dispatch(authError(e));
			return;
		}
	};
}

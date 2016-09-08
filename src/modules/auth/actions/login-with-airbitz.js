import { augur } from '../../../services/augurjs';
import {
	loadLoginAccountDependents,
	loadLoginAccountLocalStorage
} from '../../auth/actions/load-login-account';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { authError } from '../../auth/actions/auth-error';

export function loginWithAirbitz(airbitzAccount) {
	return (dispatch, getState) => {
		const { links } = require('../../../selectors');
		const localStorageRef = typeof window !== 'undefined' && window.localStorage;
		augur.web.loginWithMasterKey(airbitzAccount.username, airbitzAccount.rootKey, (account) => {
			console.log(account);
			if (!account) {
				return dispatch(authError({ code: 0, message: 'failed to login' }));
			} else if (account.error) {
				return dispatch(authError({ code: account.error, message: account.message }));
			}
			const loginAccount = { ...account, id: account.address, airbitzAccount: airbitzAccount};
			if (!loginAccount || !loginAccount.id) {
				return;
			}
			dispatch(loadLoginAccountLocalStorage(loginAccount.id));
			dispatch(updateLoginAccount(loginAccount));
			dispatch(loadLoginAccountDependents());
			if (links && links.marketsLink)	{
				links.marketsLink.onClick(links.marketsLink.href);
			}
		});
	};
}

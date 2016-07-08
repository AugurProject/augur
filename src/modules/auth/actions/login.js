import * as AugurJS from '../../../services/augurjs';

import {
	loadLoginAccountDependents,
	loadLoginAccountLocalStorage
} from '../../auth/actions/load-login-account';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { authError } from '../../auth/actions/auth-error';

export function login(secureLoginID, password) {
	return (dispatch, getState) => {
		const { links } = require('../../../selectors');
		AugurJS.login(secureLoginID, password, (err, loginAccount) => {
			console.log('login error:', err);
			if (err) {
				return dispatch(authError(err));
			}
			if (!loginAccount || !loginAccount.id) {
				return;
			}

			dispatch(loadLoginAccountLocalStorage(loginAccount.id));
			dispatch(updateLoginAccount(loginAccount));
			console.log('dispatched updated login account');
			dispatch(loadLoginAccountDependents());
			console.log('dispatched the loadLoginAccountDependents');
			console.log(links.accountLink.onClick.toString());
			links.accountLink.onClick();
			console.log(`should have called accountLink.onClick`);
			return;
		});
	};
}

import * as AugurJS from '../../../services/augurjs';

import { loadLoginAccountDependents } from '../../auth/actions/load-login-account';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { authError } from '../../auth/actions/auth-error';
import { loadLoginAccountLocalStorage } from '../../auth/actions/load-login-account';

export function login(username, password) {
	return (dispatch, getState) => {
		var { links } = require('../../../selectors');
		AugurJS.login(username, password, true, (err, loginAccount) => {
			if (err) {
				return dispatch(authError(err));
			}
			if (!loginAccount || !loginAccount.id) {
				return;
			}

			dispatch(loadLoginAccountLocalStorage(loginAccount.id));
			dispatch(updateLoginAccount(loginAccount));
			dispatch(loadLoginAccountDependents());
			links.marketsLink.onClick();
			return;
		});
	};
}
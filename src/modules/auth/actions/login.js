import * as AugurJS from '../../../services/augurjs';

import { loadLoginAccountDependents } from '../../auth/actions/load-login-account';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { authError } from '../../auth/actions/auth-error';

export function login(username, password) {
	return (dispatch, getState) => {
		var { links } = require('../../../selectors');
		AugurJS.login(username, password, true, (err, loginAccount) => {
			if (err) {
				return dispatch(authError(err));
			}
			dispatch(updateLoginAccount(loginAccount));
			dispatch(loadLoginAccountDependents());
			links.marketsLink.onClick();
			return;
		});
	};
}
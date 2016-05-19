import * as AugurJS from '../../../services/augurjs';

import { clearLoginAccount } from '../../auth/actions/update-login-account';

export function logout() {
	return (dispatch) => {
		AugurJS.logout();
		dispatch(clearLoginAccount());
	};
}

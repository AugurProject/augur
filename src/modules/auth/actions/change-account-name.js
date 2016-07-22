import * as AugurJS from '../../../services/augurjs';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { authError } from '../../auth/actions/auth-error';

export function changeAccountName(name) {
	return (dispatch, getState) => {
		const localStorageRef = typeof window !== 'undefined' && window.localStorage;

		AugurJS.changeAccountName(name, (err, loginAccount) => {
			if (err) {
				dispatch(authError(err));
				return;
			}

			if (localStorageRef && localStorageRef.setItem && localStorageRef.getItem && localStorageRef.getItem('account')) {
				localStorageRef.setItem('account', JSON.stringify(loginAccount));
			}

			dispatch(updateLoginAccount(loginAccount));
		});
	};
}

import { augur } from '../../../services/augurjs';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { authError } from '../../auth/actions/auth-error';

export function changeAccountName(name) {
	return (dispatch, getState) => {
		augur.web.changeAccountName(name, (account) => {
			if (!account || account.error) {
				return dispatch(authError({
					code: 0,
					message: 'failed to edit account name'
				}));
			}
			const loginAccount = { ...account };
			const localStorageRef = typeof window !== 'undefined' && window.localStorage;
			if (localStorageRef && localStorageRef.setItem && localStorageRef.getItem && localStorageRef.getItem('account')) {
				localStorageRef.setItem('account', JSON.stringify(loginAccount));
			}
			dispatch(updateLoginAccount(loginAccount));
		});
	};
}

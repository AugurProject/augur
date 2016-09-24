import { augur } from '../../../services/augurjs';
import { clearLoginAccount } from '../../auth/actions/update-login-account';

export function logout() {
	return (dispatch, getState) => {
		const localStorageRef = typeof window !== 'undefined' && window.localStorage;
		augur.web.logout();
		if (localStorageRef && localStorageRef.removeItem) {
			localStorageRef.removeItem('account');
		}
		dispatch(clearLoginAccount());
	};
}

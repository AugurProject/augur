import { augur } from '../../../services/augurjs';
import { clearLoginAccount } from '../../auth/actions/update-login-account';

export function logout() {
	return (dispatch, getState) => {
		const localStorageRef = typeof window !== 'undefined' && window.localStorage;
		augur.Sessions.logout({
			onSent: (r) => {
				console.log('augur.Sessions.logout sent:', r);
				augur.web.logout();
				if (localStorageRef && localStorageRef.removeItem) {
					localStorageRef.removeItem('account');
				}
				dispatch(clearLoginAccount());
			},
			onSuccess: (r) => console.log('augur.Sessions.logout success:', r),
			onFailed: (e) => {
				console.error('augur.Sessions.logout failed:', e);
				augur.web.logout();
				if (localStorageRef && localStorageRef.removeItem) {
					localStorageRef.removeItem('account');
				}
				dispatch(clearLoginAccount());
			}
		});
	};
}

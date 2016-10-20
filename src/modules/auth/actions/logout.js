import { augur } from '../../../services/augurjs';
import { clearLoginAccount } from '../../auth/actions/update-login-account';

export function logout() {
	return (dispatch, getState) => {
		const localStorageRef = typeof window !== 'undefined' && window.localStorage;
		augur.web.logout();
		if (localStorageRef && localStorageRef.removeItem) {
			localStorageRef.removeItem('account');
			localStorageRef.removeItem('airbitz.current_user');
			localStorageRef.removeItem('airbitz.users');
			// for (let i = 0; i < localStorageRef.length; i++){
			//     console.log(i, localStorageRef.key(i), localStorageRef.key(i).indexOf('airbitz'))
			//     if (localStorageRef.key(i).indexOf('airbitz') > -1) {
			//         console.log('removing localStorage', localStorageRef.key(i));
			//         localStorageRef.removeItem(localStorageRef.key(i));
			//     }
			// }
		}
		dispatch(clearLoginAccount());
	};
}

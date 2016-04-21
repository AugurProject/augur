import { UPDATE_LOGIN_ACCOUNT, CLEAR_LOGIN_ACCOUNT } from '../actions/update-login-account';
import { SHOW_LINK } from '../../link/actions/link-actions';
import { PATHS_AUTH } from '../../link/constants/paths';
import { LOGOUT } from '../../auth/constants/auth-types';

export default function(loginAccount = {}, action) {
    switch (action.type) {
        case SHOW_LINK:
        	if (PATHS_AUTH[action.parsedURL.pathArray[0]] === LOGOUT) {
        		return {};
        	}
            return loginAccount;

        case UPDATE_LOGIN_ACCOUNT:
            return {
                ...loginAccount,
                ...action.data || {}
            };

        case CLEAR_LOGIN_ACCOUNT:
            return {};

        default:
            return loginAccount;
    }
}
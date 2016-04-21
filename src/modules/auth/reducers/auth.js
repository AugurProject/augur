import { DEFAULT_AUTH_TYPE } from '../../auth/constants/auth-types';
import { PATHS_AUTH } from '../../link/constants/paths';

import { SHOW_LINK } from '../../link/actions/link-actions';
import { AUTH_ERROR } from '../../auth/actions/auth-error';

export default function(auth = { selectedAuthType: DEFAULT_AUTH_TYPE, err: null }, action) {
    switch (action.type) {
        case SHOW_LINK:
            return {
                ...auth,
                selectedAuthType: PATHS_AUTH[action.parsedURL.pathArray[0]] || DEFAULT_AUTH_TYPE,
                err: null
            };

        case AUTH_ERROR:
            return {
                ...auth,
        		err: action.err
            };

        default:
            return auth;
    }
}
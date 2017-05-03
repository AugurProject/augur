import { DEFAULT_AUTH_TYPE } from 'modules/auth/constants/auth-types';

import { UPDATE_URL } from 'modules/link/actions/update-url';
import { AUTH_ERROR } from 'modules/auth/actions/auth-error';

export default function (auth = { selectedAuthType: DEFAULT_AUTH_TYPE, err: null }, action) {
  switch (action.type) {
    case UPDATE_URL:
      return {
        ...auth,
        selectedAuthType: action.parsedURL.searchParams.page || DEFAULT_AUTH_TYPE,
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

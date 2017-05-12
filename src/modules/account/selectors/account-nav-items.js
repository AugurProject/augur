import { ACCOUNT_DETAILS } from 'modules/account/constants/views';

export default function () {
  return {
    [ACCOUNT_DETAILS]: {
      label: 'Sign Up'
    },
    [AUTH_LOGIN]: {
      label: 'Login'
    },
    [AUTH_IMPORT]: {
      label: 'Import'
    }
  };
}

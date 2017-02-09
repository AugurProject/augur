import { AUTH_SIGNUP, AUTH_LOGIN, AUTH_IMPORT } from 'modules/app/constants/views';

export default function () {
  return {
    [AUTH_SIGNUP]: {
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

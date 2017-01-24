import store from 'src/store';

import { selectAirbitzLink } from 'modules/link/selectors/links';
// selectAirbitzOnLoad

import { REGISTER, LOGIN } from 'modules/auth/constants/auth-types';

export default function () {
  return {
    airbitzLoginLink: selectAirbitzLink(LOGIN, store.dispatch),
    airbitzRegisterLink: selectAirbitzLink(REGISTER, store.dispatch)
  };
}

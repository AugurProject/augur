import store from 'src/store';

import { selectAirbitzLink, selectAirbitzOnLoad } from 'modules/link/selectors/links';

import { REGISTER, LOGIN } from 'modules/auth/constants/auth-types';

export default function () {
  return {
    airbitzLoginLink: selectAirbitzLink(LOGIN, store.dispatch),
    airbitzOnLoad: selectAirbitzOnLoad(store.dispatch)
  };
}

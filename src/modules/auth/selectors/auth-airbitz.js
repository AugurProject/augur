import store from 'src/store';

import { selectAirbitzLink, selectAirbitzOnLoad } from 'modules/link/selectors/links';

export default function () {
  return {
    airbitzLoginLink: selectAirbitzLink(null, store.dispatch),
    airbitzOnLoad: selectAirbitzOnLoad(store.dispatch)
  };
}

import store from 'src/store';

import { importAccount } from 'modules/auth/actions/import-account';

export default function () {
  return {
    importAccountFromFile
  };
}

function importAccountFromFile(password, remember, keystore) {
  store.dispatch(importAccount(password, remember, keystore));
}

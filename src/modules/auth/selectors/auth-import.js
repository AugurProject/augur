import store from 'src/store';

import { importAccount } from 'modules/auth/actions/import-account';

export default function () {
  return {
    importAccountFromFile
  };
}

function importAccountFromFile(password, keystore) {
  store.dispatch(importAccount(password, keystore));
}

import { augur } from '../../../services/augurjs';
import { loadAccountData } from '../../auth/actions/load-account-data';
import { savePersistentAccountToLocalStorage } from '../../auth/actions/save-persistent-account';

export const importAccount = (password, rememberMe, keystore) => (dispatch, getState) => (
  augur.accounts.importAccount(password, keystore, (account) => {
    if (!account || !account.keystore) {
      return console.error('importAccount failed:', account);
    }
    const loginID = augur.base58Encode(account);
    if (rememberMe) savePersistentAccountToLocalStorage({ ...account, loginID });
    dispatch(loadAccountData({ loginID, address: account.address }, true));
  })
);

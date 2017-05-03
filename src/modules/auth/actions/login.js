import { augur } from 'services/augurjs';
import { base58Decode } from 'utils/base-58';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import { savePersistentAccountToLocalStorage } from 'modules/auth/actions/save-persistent-account';

export const login = (loginID, password, rememberMe, cb) => (dispatch, getState) => {
  const callback = cb || (e => e && console.error('login:', e));
  const accountObject = base58Decode(loginID);
  if (!accountObject || !accountObject.keystore) {
    return callback({ code: 0, message: 'could not decode login ID' });
  }
  augur.accounts.login(accountObject.keystore, password, (account) => {
    if (!account) {
      return callback({ code: 0, message: 'failed to login' });
    } else if (account.error) {
      return callback({ code: account.error, message: account.message });
    } else if (!account.address) {
      return callback(account);
    }
    if (rememberMe) savePersistentAccountToLocalStorage({ ...account, loginID });
    dispatch(loadAccountData({ loginID, address: account.address, name: accountObject.name }, true));
    callback(null);
  });
};

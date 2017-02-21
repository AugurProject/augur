import { augur } from '../../../services/augurjs';
import { loadAccountData } from '../../auth/actions/load-account-data';
import { savePersistentAccountToLocalStorage } from '../../auth/actions/save-persistent-account';
import { updateLoginAccount } from '../../auth/actions/update-login-account';

export const register = (password, cb) => (dispatch) => {
  const callback = cb || (e => e && console.error('register:', e));
  augur.accounts.register(password, (account) => {
    if (!account || !account.address) {
      return callback({ code: 0, message: 'failed to register' });
    } else if (account.error) {
      return callback({ code: account.error, message: account.message });
    }
    const loginID = augur.base58Encode(account);
    callback(null, loginID);
  });
};

export const setupAndFundNewAccount = (password, loginID, rememberMe, cb) => (dispatch, getState) => {
  const callback = cb || (e => e && console.error('setupAndFundNewAccount:', e));
  if (!loginID) return callback({ message: 'loginID is required' });
  if (rememberMe) savePersistentAccountToLocalStorage({ ...augur.accounts.account, loginID });
  dispatch(updateLoginAccount({ loginID, address: augur.accounts.account.address }));
  dispatch(loadAccountData(getState().loginAccount, true));
  callback(null);
};

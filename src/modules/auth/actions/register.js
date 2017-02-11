import { augur } from '../../../services/augurjs';
import { displayLoginMessageOrMarkets, loadFullAccountData, savePersistentAccountToLocalStorage } from '../../auth/actions/load-login-account';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { registerTimestamp } from '../../auth/actions/register-timestamp';
import { fundNewAccount } from '../../auth/actions/fund-new-account';

export const register = (password, cb) => (dispatch) => {
  const callback = cb || (e => console.log('register:', e));
  augur.accounts.register(null, password, (account) => {
    if (!account || !account.address) {
      return callback({ code: 0, message: 'failed to register' });
    } else if (account.error) {
      return callback({ code: account.error, message: account.message });
    }
    const loginID = augur.base58Encode(account);
    dispatch(updateLoginAccount({ loginID, address: account.address }));
    callback(null, loginID);
  });
};

export const setupAndFundNewAccount = (password, loginID, rememberMe, cb) => (dispatch, getState) => {
  const callback = cb || (e => console.log('setupAndFundNewAccount:', e));
  if (!loginID) return callback({ message: 'loginID is required' });
  const { loginAccount } = getState();
  if (rememberMe) savePersistentAccountToLocalStorage(loginAccount);
  dispatch(loadFullAccountData(loginAccount, (err) => {
    if (err) return console.error(err);
    dispatch(fundNewAccount((err) => {
      if (err) return console.error(err);
      dispatch(registerTimestamp());
    }));
  }));
  dispatch(displayLoginMessageOrMarkets(loginAccount));
  callback(null);
};

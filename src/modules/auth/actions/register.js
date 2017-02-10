import { augur } from '../../../services/augurjs';
import { loadLoginAccountDependents, loadLoginAccountLocalStorage } from '../../auth/actions/load-login-account';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { registerTimestamp } from '../../auth/actions/register-timestamp';
import { fundNewAccount } from '../../auth/actions/fund-new-account';
import isCurrentLoginMessageRead from '../../login-message/helpers/is-current-login-message-read';
import isUserLoggedIn from '../../auth/helpers/is-user-logged-in';

export const register = (password, cb) => (dispatch) => {
  const callback = cb || (e => console.log('register:', e));
  augur.accounts.register(null, password, (account) => {
    if (!account || !account.address) {
      return callback({ code: 0, message: 'failed to register' });
    } else if (account.error) {
      return callback({ code: account.error, message: account.message });
    }
    const loginID = augur.base58Encode({ keystore: account.keystore });
    dispatch(updateLoginAccount({ loginID }));
    callback(null, loginID);
  });
};

export const savePersistentAccountToLocalStorage = (account) => {
  const localStorageRef = typeof window !== 'undefined' && window.localStorage;
  if (localStorageRef && localStorageRef.setItem) {
    const persistentAccount = { ...account };
    if (Buffer.isBuffer(persistentAccount.privateKey)) {
      persistentAccount.privateKey = persistentAccount.privateKey.toString('hex');
    }
    if (Buffer.isBuffer(persistentAccount.derivedKey)) {
      persistentAccount.derivedKey = persistentAccount.derivedKey.toString('hex');
    }
    localStorageRef.setItem('account', JSON.stringify(persistentAccount));
  }
};

// decide if we need to display the login message
export const displayLoginMessageOrMarkets = account => (dispatch, getState) => {
  const { links } = require('../../../selectors');
  if (links && links.marketsLink) {
    const { loginMessage } = getState();
    if (isUserLoggedIn(account) && !isCurrentLoginMessageRead(loginMessage)) {
      links.loginMessageLink.onClick();
    } else {
      links.marketsLink.onClick();
    }
  }
};

export const setupAndFundNewAccount = (password, loginID, rememberMe, cb) => (dispatch) => {
  const callback = cb || (e => console.log('setupAndFundNewAccount:', e));
  if (!loginID) return callback({ message: 'loginID is required' });
  const { account } = augur.accounts;
  if (rememberMe) savePersistentAccountToLocalStorage(account);
  dispatch(loadLoginAccountLocalStorage(account.address));
  dispatch(loadLoginAccountDependents((err) => {
    if (err) return console.error(err);
    dispatch(fundNewAccount((err) => {
      if (err) return console.error(err);
      dispatch(registerTimestamp());
    }));
  }));
  dispatch(displayLoginMessageOrMarkets(account));
  callback(null);
};

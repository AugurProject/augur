import { augur } from 'services/augurjs';
import { base58Decode, base58Encode } from 'utils/base-58';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import { updateLoginAccount } from 'modules/auth/actions/update-login-account';
import logError from 'utils/log-error';

export const register = (password, callback = logError) => dispatch => (
  augur.accounts.register(password, (account) => {
    if (!account || !account.address) {
      return callback({ code: 0, message: 'failed to register' });
    } else if (account.error) {
      return callback({ code: account.error, message: account.message });
    }
    const loginID = base58Encode(account);
    callback(null, loginID);
  })
);

export const setupAndFundNewAccount = (password, loginID, callback = logError) => (dispatch, getState) => {
  if (!loginID) return callback({ message: 'loginID is required' });
  const keystore = base58Decode(loginID);
  dispatch(loadAccountData({ loginID, keystore, address: keystore.address }, true));
  callback(null);
};

import { augur } from '../../../services/augurjs';
import { displayLoginMessageOrMarkets, loadFullAccountData, savePersistentAccountToLocalStorage } from '../../auth/actions/load-login-account';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { fundNewAccount } from '../../auth/actions/fund-new-account';
import { anyAccountBalancesZero } from '../../auth/selectors/balances';

export const login = (loginID, password, rememberMe, cb) => (dispatch, getState) => {
  const callback = cb || (e => console.log('login:', e));
  const accountObject = augur.base58Decode(loginID);
  if (!accountObject || !accountObject.keystore) {
    return callback({ code: 0, message: 'could not decode login ID' });
  }
  console.log('login:', loginID);
  augur.accounts.login(accountObject.keystore, password, (account) => {
    if (!account) {
      callback({ code: 0, message: 'failed to login' });
    } else if (account.error) {
      callback({ code: account.error, message: account.message });
    } else if (account.address) {
      dispatch(updateLoginAccount({ loginID, address: account.address, name: accountObject.name }));
      if (rememberMe) savePersistentAccountToLocalStorage({ ...account, loginID });
      dispatch(loadFullAccountData(account, (err, balances) => {
        if (err || !balances) return console.error(err);
        if (anyAccountBalancesZero(balances)) dispatch(fundNewAccount());
      }));
      dispatch(displayLoginMessageOrMarkets(account));
      callback(null);
    }
  });
};

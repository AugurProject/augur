import { augur } from '../../../services/augurjs';
import { loadFullAccountData } from '../../auth/actions/load-login-account';
import { fundNewAccount } from '../../auth/actions/fund-new-account';
import { registerTimestamp } from '../../auth/actions/register-timestamp';
import { anyAccountBalancesZero } from '../../auth/selectors/balances';

export const importAccount = (password, rememberMe, keystore) => (dispatch, getState) => {
  const { links } = require('../../../selectors');
  const localStorageRef = typeof window !== 'undefined' && window.localStorage;
  augur.accounts.importAccount(password, keystore, (importedAccount) => {
    if (importedAccount && importedAccount.keystore) {
      const loginID = augur.base58Encode(importedAccount);
      if (rememberMe && localStorageRef && localStorageRef.setItem) {
        const persistentAccount = { ...importedAccount };
        if (Buffer.isBuffer(persistentAccount.privateKey)) {
          persistentAccount.privateKey = persistentAccount.privateKey.toString('hex');
        }
        persistentAccount.loginID = loginID;
        localStorageRef.setItem('account', JSON.stringify(persistentAccount));
      }
      dispatch(loadFullAccountData({ ...importedAccount, loginID }, (err, balances) => {
        if (err || !balances) return console.error(err);
        if (anyAccountBalancesZero(balances)) {
          dispatch(fundNewAccount((e) => {
            if (e) return console.error(e);
            if (!getState().loginAccount.registerBlockNumber) {
              dispatch(registerTimestamp());
            }
          }));
        } else if (!getState().loginAccount.registerBlockNumber) {
          dispatch(registerTimestamp());
        }
      }));
      if (links && links.marketsLink) {
        links.marketsLink.onClick(links.marketsLink.href);
      }
    }
  });
};

import { accounts } from '../../../services/augurjs';
import { loadFullAccountData } from '../../auth/actions/load-login-account';
import { fundNewAccount } from '../../auth/actions/fund-new-account';
import { registerTimestamp } from '../../auth/actions/register-timestamp';
import { anyAccountBalancesZero } from '../../auth/selectors/balances';

export function importAccount(name, password, rememberMe, keystore) {
  return (dispatch, getState) => {
    const { links } = require('../../../selectors');
    const localStorageRef = typeof window !== 'undefined' && window.localStorage;
    accounts.importAccount(name, password, keystore, (loginAccount) => {
      console.log('importAccount -- ', importAccount);
      const importedAccount = { ...loginAccount };
      if (importedAccount && importedAccount.keystore) {
        if (rememberMe && localStorageRef && localStorageRef.setItem) {
          const persistentAccount = { ...importedAccount };
          if (Buffer.isBuffer(persistentAccount.privateKey)) {
            persistentAccount.privateKey = persistentAccount.privateKey.toString('hex');
          }
          localStorageRef.setItem('account', JSON.stringify(persistentAccount));
        }
        dispatch(loadFullAccountData(importedAccount, (err, balances) => {
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
          return links.marketsLink.onClick(links.marketsLink.href);
        }
      }
    });
  };
}

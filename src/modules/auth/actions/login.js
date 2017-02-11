import { augur } from '../../../services/augurjs';
import { loadFullAccountData } from '../../auth/actions/load-login-account';
import { savePersistentAccountToLocalStorage } from '../../auth/actions/register';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { fundNewAccount } from '../../auth/actions/fund-new-account';
import isCurrentLoginMessageRead from '../../login-message/helpers/is-current-login-message-read';
import { anyAccountBalancesZero } from '../../auth/selectors/balances';

export function login(loginID, password, rememberMe, cb) {
  return (dispatch, getState) => {
    augur.accounts.login(loginID, password, (account) => {
      if (!account) {
        cb && cb({
          code: 0,
          message: 'failed to login'
        });
        return;
      } else if (account.error) {
        cb && cb({
          code: account.error,
          message: account.message
        });
        return;
      }
      if (account.address) {
        const loginID = augur.base58Encode({ keystore: account.keystore });
        dispatch(updateLoginAccount({ loginID }));
        if (rememberMe) savePersistentAccountToLocalStorage(account);
        dispatch(loadFullAccountData(account, (err, balances) => {
          if (err || !balances) return console.error(err);
          if (anyAccountBalancesZero(balances)) dispatch(fundNewAccount());
        }));
        cb && cb();

        // need to load selectors here as they get updated above
        const { links } = require('../../../selectors');
        if (isCurrentLoginMessageRead(getState().loginMessage)) {
          links.marketsLink.onClick(links.marketsLink.href);
        } else {
          links.loginMessageLink.onClick();
        }
      }
    });
  };
}

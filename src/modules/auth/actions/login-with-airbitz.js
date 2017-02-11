import secureRandom from 'secure-random';
import { augur } from '../../../services/augurjs';
import { AIRBITZ_WALLET_TYPE } from '../../auth/constants/auth-types';
import { loadFullAccountData } from '../../auth/actions/load-login-account';
import { registerTimestamp } from '../../auth/actions/register-timestamp';
import { fundNewAccount } from '../../auth/actions/fund-new-account';
import { anyAccountBalancesZero } from '../../auth/selectors/balances';

export function loginWithEthereumWallet(airbitzAccount, ethereumWallet, isNewAccount) {
  return (dispatch, getState) => {
    const { links } = require('../../../selectors');
    const masterPrivateKey = ethereumWallet.keys.ethereumKey;
    augur.accounts.loginWithMasterKey(masterPrivateKey, (account) => {
      console.log('loginWithMasterKey:', account);
      if (!account) {
        return console.error({ code: 0, message: 'failed to login' });
      } else if (account.error) {
        return console.error({ code: account.error, message: account.message });
      }
      const loginAccount = { ...account, airbitzAccount };
      if (!loginAccount || !loginAccount.address) {
        return;
      }
      dispatch(loadFullAccountData({ address: account.address, name: airbitzAccount.username }, (err, balances) => {
        if (err || !balances) return console.error(err);
        if (anyAccountBalancesZero(balances)) {
          dispatch(fundNewAccount((err) => {
            if (err) return console.error(err);
            if (isNewAccount) dispatch(registerTimestamp());
          }));
        }
      }));
      if (links && links.marketsLink) {
        links.marketsLink.onClick(links.marketsLink.href);
      }
    });
  };
}

export function loginWithAirbitz(airbitzAccount) {
  return (dispatch, getState) => {
    const ethereumWallet = airbitzAccount.getFirstWallet(AIRBITZ_WALLET_TYPE);

    // Create an ethereum wallet if one doesn't exist
    if (ethereumWallet == null) {
      const keys = {
        ethereumKey: new Buffer(secureRandom(32)).toString('hex')
      };
      airbitzAccount.createWallet(AIRBITZ_WALLET_TYPE, keys, (err, id) => {
        if (err) return console.error({ code: 0, message: 'could not create wallet' });
        dispatch(loginWithEthereumWallet(airbitzAccount, airbitzAccount.getWallet(id)));
      });

    } else {
      dispatch(loginWithEthereumWallet(airbitzAccount, ethereumWallet));
    }
  };
}

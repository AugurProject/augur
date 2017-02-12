import secureRandom from 'secure-random';
import { augur } from '../../../services/augurjs';
import { AIRBITZ_WALLET_TYPE } from '../../auth/constants/auth-types';
import { loadFullAccountData } from '../../auth/actions/load-account-data';
import { registerTimestamp } from '../../auth/actions/register-timestamp';
import { fundNewAccount } from '../../auth/actions/fund-new-account';
import { anyAccountBalancesZero } from '../../auth/selectors/balances';
import { displayLoginMessageOrMarkets } from '../../login-message/actions/display-login-message';

export const loginWithEthereumWallet = (airbitzAccount, ethereumWallet, isNewAccount) => (dispatch) => {
  const masterPrivateKey = ethereumWallet.keys.ethereumKey;
  augur.accounts.loginWithMasterKey(masterPrivateKey, (account) => {
    if (!account || !account.address || account.error) {
      return console.error(account);
    }
    dispatch(loadFullAccountData({ address: account.address, name: airbitzAccount.username, airbitzAccount }, (err, balances) => {
      if (err || !balances) return console.error(err);
      if (anyAccountBalancesZero(balances)) {
        dispatch(fundNewAccount((err) => {
          if (err) return console.error(err);
          if (isNewAccount) dispatch(registerTimestamp());
        }));
      }
      dispatch(displayLoginMessageOrMarkets(account));
    }));
  });
};

export const loginWithAirbitz = airbitzAccount => (dispatch) => {
  const ethereumWallet = airbitzAccount.getFirstWallet(AIRBITZ_WALLET_TYPE);

  // Create an ethereum wallet if one doesn't exist
  if (ethereumWallet == null) {
    airbitzAccount.createWallet(AIRBITZ_WALLET_TYPE, { ethereumKey: new Buffer(secureRandom(32)).toString('hex') }, (err, id) => {
      if (err) return console.error({ code: 0, message: 'could not create wallet' });
      dispatch(loginWithEthereumWallet(airbitzAccount, airbitzAccount.getWallet(id)));
    });

  } else {
    dispatch(loginWithEthereumWallet(airbitzAccount, ethereumWallet));
  }
};

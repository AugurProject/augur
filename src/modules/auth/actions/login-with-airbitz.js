import secureRandom from 'secure-random';
import { augur } from '../../../services/augurjs';
import { AIRBITZ_WALLET_TYPE } from '../../auth/constants/auth-types';
import { loadAccountData } from '../../auth/actions/load-account-data';

export const loginWithAirbitzEthereumWallet = (airbitzAccount, ethereumWallet, isNewAccount) => (dispatch) => {
  const masterPrivateKey = ethereumWallet.keys.ethereumKey;
  augur.accounts.loginWithMasterKey(masterPrivateKey, (account) => {
    if (!account || !account.address || account.error) {
      return console.error(account);
    }
    dispatch(loadAccountData({ address: account.address, name: airbitzAccount.username, airbitzAccount }, true));
  });
};

// Create an ethereum wallet if one doesn't exist
export const loginWithAirbitz = airbitzAccount => (dispatch) => {
  const ethereumWallet = airbitzAccount.getFirstWallet(AIRBITZ_WALLET_TYPE);
  if (ethereumWallet != null) {
    return dispatch(loginWithAirbitzEthereumWallet(airbitzAccount, ethereumWallet));
  }
  airbitzAccount.createWallet(AIRBITZ_WALLET_TYPE, { ethereumKey: new Buffer(secureRandom(32)).toString('hex') }, (err, id) => {
    if (err) return console.error({ code: 0, message: 'could not create wallet' });
    dispatch(loginWithAirbitzEthereumWallet(airbitzAccount, airbitzAccount.getWallet(id)));
  });
};

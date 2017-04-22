import { augur } from 'services/augurjs';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import { useUnlockedAccount } from 'modules/auth/actions/use-unlocked-account';

// If there is an available logged-in/unlocked account, set as the user's sending address.
export const setLoginAccount = autoLogin => (dispatch, getState) => {

  // 1. Client-side account
  const { account } = augur.accounts;
  if (account.address && account.privateKey) {
    console.log('using client-side account:', account.address);
    dispatch(loadAccountData({ address: account.address }));

  // 2. If autoLogin=true, use an unlocked local Ethereum node (if present)
  } else if (autoLogin) {
    dispatch(useUnlockedAccount(getState().coinbase));
  }
};

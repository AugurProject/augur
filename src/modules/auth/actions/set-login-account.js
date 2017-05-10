import { augur } from 'services/augurjs';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import { useUnlockedAccount } from 'modules/auth/actions/use-unlocked-account';

// If there is an available logged-in/unlocked account, set as the user's sending address.
export const setLoginAccount = autoLogin => (dispatch, getState) => {
  const localStorageRef = typeof window !== 'undefined' && window.localStorage;

  // 1. Client-side account
  const { account } = augur.accounts;
  if (account.address && account.privateKey) {
    console.log('using client-side account:', account.address);
    dispatch(loadAccountData({ address: account.address }));

  // 2. Persistent (localStorage) account
  } else if (localStorageRef && localStorageRef.getItem && localStorageRef.getItem('account')) {
    const persistentAccount = JSON.parse(localStorageRef.getItem('account'));
    console.log('using persistent account:', persistentAccount);
    augur.accounts.setAccountObject(persistentAccount);
    dispatch(loadAccountData(persistentAccount));

  // 3. If autoLogin=true, use an unlocked local Ethereum node (if present)
  } else if (autoLogin) {
    dispatch(useUnlockedAccount(augur.from));
  }
};

import { augur } from '../../../services/augurjs';
import { loadFullAccountData } from '../../auth/actions/load-account-data';
import { useUnlockedAccount } from '../../auth/actions/use-unlocked-account';

export const savePersistentAccountToLocalStorage = (account) => {
  const localStorageRef = typeof window !== 'undefined' && window.localStorage;
  if (localStorageRef && localStorageRef.setItem) {
    const persistentAccount = { ...account };
    if (Buffer.isBuffer(persistentAccount.privateKey)) {
      persistentAccount.privateKey = persistentAccount.privateKey.toString('hex');
    }
    if (Buffer.isBuffer(persistentAccount.derivedKey)) {
      persistentAccount.derivedKey = persistentAccount.derivedKey.toString('hex');
    }
    localStorageRef.setItem('account', JSON.stringify(persistentAccount));
  }
};

// If there is an available logged-in/unlocked account, set as the user's sending address.
export const setLoginAccount = autoLogin => (dispatch, getState) => {
  const localStorageRef = typeof window !== 'undefined' && window.localStorage;

  // 1. Client-side account
  const { account } = augur.accounts;
  if (account.address && account.privateKey) {
    console.log('using client-side account:', account.address);
    dispatch(loadFullAccountData({ address: account.address }));

  // 2. Persistent (localStorage) account
  } else if (localStorageRef && localStorageRef.getItem && localStorageRef.getItem('account')) {
    const persistentAccount = JSON.parse(localStorageRef.getItem('account'));
    augur.accounts.setAccountObject(persistentAccount);
    dispatch(loadFullAccountData(persistentAccount));

  // 3. If autoLogin=true, use an unlocked local Ethereum node (if present)
  } else if (autoLogin) {
    dispatch(useUnlockedAccount(augur.from));
  }
};

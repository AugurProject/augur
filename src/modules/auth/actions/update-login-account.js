import { augur } from '../../../services/augurjs';

export const UPDATE_LOGIN_ACCOUNT = 'UPDATE_LOGIN_ACCOUNT';
export const CLEAR_LOGIN_ACCOUNT = 'CLEAR_LOGIN_ACCOUNT';

export function updateLoginAccount(loginAccount) {
  const localStorageRef = typeof window !== 'undefined' && window.localStorage;
  if (localStorageRef && localStorageRef.setItem && localStorageRef.getItem && localStorageRef.getItem('account') && loginAccount.name) {
    const persistentAccount = JSON.parse(localStorageRef.getItem('account'));
    const accountObject = { ...persistentAccount, ...loginAccount };
    delete accountObject.loginID;
    const loginID = augur.base58Encode(accountObject);
    localStorageRef.setItem('account', JSON.stringify({ ...accountObject, loginID }));
  }
  return { type: UPDATE_LOGIN_ACCOUNT, data: loginAccount };
}

export function clearLoginAccount() {
  return { type: CLEAR_LOGIN_ACCOUNT };
}

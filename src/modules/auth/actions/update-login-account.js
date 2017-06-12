import { augur } from 'services/augurjs';
import { base58Encode } from 'utils/base-58';

export const UPDATE_LOGIN_ACCOUNT = 'UPDATE_LOGIN_ACCOUNT';
export const CLEAR_LOGIN_ACCOUNT = 'CLEAR_LOGIN_ACCOUNT';

export function changeAccountName(name) {
  const accountObject = { ...augur.accounts.account, name };
  const loginID = base58Encode(accountObject);
  const localStorageRef = typeof window !== 'undefined' && window.localStorage;
  if (localStorageRef && localStorageRef.setItem && localStorageRef.getItem && localStorageRef.getItem('account')) {
    localStorageRef.setItem('account', JSON.stringify({ ...accountObject, loginID }));
  }
  return { type: UPDATE_LOGIN_ACCOUNT, data: { name, loginID } };
}

export function updateLoginAccount(loginAccount) {
  return { type: UPDATE_LOGIN_ACCOUNT, data: loginAccount };
}

export function clearLoginAccount() {
  return { type: CLEAR_LOGIN_ACCOUNT };
}

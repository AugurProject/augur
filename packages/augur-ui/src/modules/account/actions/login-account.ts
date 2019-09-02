import { LoginAccount, AccountBalances } from 'modules/types';

export const UPDATE_LOGIN_ACCOUNT = 'UPDATE_LOGIN_ACCOUNT';
export const UPDATE_LOGIN_ACCOUNT_BALANCES = 'UPDATE_LOGIN_ACCOUNT_BALANCES';
export const CLEAR_LOGIN_ACCOUNT = 'CLEAR_LOGIN_ACCOUNT';

export interface UpdateLoginAccountAction {
  type: string;
  data: Partial<LoginAccount>;
}

export function updateLoginAccount(
  data: Partial<LoginAccount>
): UpdateLoginAccountAction {
  return {
    type: UPDATE_LOGIN_ACCOUNT,
    data,
  };
}

export interface ClearLoginAccountAction {
  type: typeof CLEAR_LOGIN_ACCOUNT;
  data: Partial<LoginAccount>;
}

export function clearLoginAccount(): ClearLoginAccountAction {
  return {
    type: CLEAR_LOGIN_ACCOUNT,
    data: null,
  };
}

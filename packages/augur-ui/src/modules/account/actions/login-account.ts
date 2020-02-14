import { LoginAccount } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import isAddress from 'modules/auth/helpers/is-address';

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

export const saveAffiliateAddress = (affiliate: string) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  return isAddress(affiliate) ? dispatch(updateLoginAccount({ affiliate })) : null;
}

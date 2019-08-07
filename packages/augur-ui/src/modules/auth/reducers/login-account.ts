import { RESET_STATE } from 'modules/app/actions/reset-state';
import {
  UPDATE_LOGIN_ACCOUNT,
  CLEAR_LOGIN_ACCOUNT,
  UPDATE_LOGIN_ACCOUNT_BALANCES,
} from 'modules/account/actions/login-account';
import { LoginAccount, BaseAction } from 'modules/types';

const DEFAULT_STATE: LoginAccount = {
  balances: {
    eth: 0,
    rep: 0,
    dai: 0,
  },
};

export default function(
  loginAccount: LoginAccount = DEFAULT_STATE,
  { type, data }: BaseAction
): LoginAccount {
  switch (type) {
    case UPDATE_LOGIN_ACCOUNT:
      return {
        ...loginAccount,
        ...(data || {}),
      };
    case UPDATE_LOGIN_ACCOUNT_BALANCES:
      return {
        ...loginAccount,
        balances: data.balances,
      };
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return loginAccount;
  }
}

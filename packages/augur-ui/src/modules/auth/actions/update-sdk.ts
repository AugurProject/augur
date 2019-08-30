import logError from 'utils/log-error';
import { augurSdk } from 'services/augursdk';
import { LoginAccount } from 'modules/types';
import { clearLoginAccount, updateLoginAccount } from "modules/account/actions/login-account";
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

export const updateSdk = (loginAccount: Partial<LoginAccount>) => (dispatch: ThunkDispatch<void, any, Action>) => {
  if (!loginAccount || !loginAccount.address || !loginAccount.meta) return;

  if (!augurSdk.sdk) return;

  try {
    augurSdk.syncUserData(loginAccount.address, loginAccount.meta.signer);
    dispatch(clearLoginAccount());
    dispatch(updateLoginAccount(loginAccount));
  } catch (error) {
    logError(error);
  }
}

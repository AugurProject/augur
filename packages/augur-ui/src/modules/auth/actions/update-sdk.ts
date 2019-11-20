import logError from 'utils/log-error';
import { augurSdk } from 'services/augursdk';
import { LoginAccount } from 'modules/types';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { toChecksumAddress } from 'ethereumjs-util';
import { updateAppStatus, GNOSIS_ENABLED } from 'modules/app/actions/update-app-status';

export const updateSdk = (
  loginAccount: Partial<LoginAccount>,
  networkId: string
) => async (dispatch: ThunkDispatch<void, any, Action>) => {
  if (!loginAccount || !loginAccount.address || !loginAccount.meta) return;
  if (!augurSdk.sdk) return;

  try {
    const useGnosis = window.localStorage.getItem('isGnosis');

    if (useGnosis) {
      const updateUserAccount = safeAddress => {
        const newAccount = {
          ...loginAccount,
          meta: { ...loginAccount.meta, address: safeAddress },
          mixedCaseAddress: toChecksumAddress(safeAddress),
          address: safeAddress.toLowerCase(),
        };
        dispatch(updateLoginAccount(newAccount));
        dispatch(updateAppStatus(GNOSIS_ENABLED, true));
      };

      await augurSdk.syncUserData(
        loginAccount.mixedCaseAddress,
        loginAccount.meta.signer,
        networkId,
        true,
        updateUserAccount
      );
    } else {
      dispatch(updateLoginAccount(loginAccount));
      await augurSdk.syncUserData(
        loginAccount.mixedCaseAddress,
        loginAccount.meta.signer,
        networkId,
        false
      );
    }
  } catch (error) {
    logError(error);
  }
};

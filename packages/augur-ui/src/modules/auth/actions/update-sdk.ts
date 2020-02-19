import logError from 'utils/log-error';
import { augurSdk } from 'services/augursdk';
import { LoginAccount } from 'modules/types';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { toChecksumAddress } from 'ethereumjs-util';
import { updateAppStatus, GNOSIS_ENABLED, Ox_ENABLED } from 'modules/app/actions/update-app-status';
import { loadAccountDataFromLocalStorage } from './load-account-data-from-local-storage';
import { IS_LOGGED, updateAuthStatus } from 'modules/auth/actions/auth-status';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { NetworkId } from '@augurproject/artifacts';
import { AppState } from 'store';

export const updateSdk = (
  loginAccount: Partial<LoginAccount>,
  networkId: string,
  useGnosis: boolean
) => async (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  if (!loginAccount || !loginAccount.address || !loginAccount.meta) return;
  if (!augurSdk.sdk) return;

  try {
    dispatch(updateAppStatus(Ox_ENABLED, !!augurSdk.sdk.zeroX));
    if (useGnosis) {
      // check for affilitate
      const affiliate = (getState().loginAccount || {}).affiliate;
      const updateUserAccount = safeAddress => {
        const newAccount = {
          ...loginAccount,
          meta: { ...loginAccount.meta, address: toChecksumAddress(safeAddress) },
          mixedCaseAddress: toChecksumAddress(safeAddress),
          address: toChecksumAddress(safeAddress),
        };
        dispatch(updateLoginAccount(newAccount));
        dispatch(updateAppStatus(GNOSIS_ENABLED, true));
        dispatch(loadAccountDataFromLocalStorage(safeAddress));
      };

      await augurSdk.syncUserData(
        loginAccount.mixedCaseAddress,
        loginAccount.meta.signer,
        networkId as NetworkId,
        true,
        affiliate,
        updateUserAccount
      );
    } else {
      dispatch(updateLoginAccount(loginAccount));
      dispatch(loadAccountDataFromLocalStorage(loginAccount.address));
      await augurSdk.syncUserData(
        loginAccount.mixedCaseAddress,
        loginAccount.meta.signer,
        networkId as NetworkId,
        false,
        null,
      );
    }

    dispatch(updateAuthStatus(IS_LOGGED, true));
    dispatch(loadAccountData());
    dispatch(updateAssets());

  } catch (error) {
    logError(error);
  }
};

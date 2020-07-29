import { TXEventName } from '@augurproject/sdk-lite';
import { AppState } from 'appStore';
import { toChecksumAddress } from 'ethereumjs-util';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { addAlert } from 'modules/alerts/actions/alerts';
import {
  Ox_ENABLED,
  updateAppStatus,
  WALLET_STATUS,
} from 'modules/app/actions/update-app-status';
import { IS_LOGGED, updateAuthStatus } from 'modules/auth/actions/auth-status';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import { updateAssets } from 'modules/auth/actions/update-assets';
import {
  CREATEAUGURWALLET,
  MODAL_ERROR,
  SUCCESS,
  WALLET_STATUS_VALUES,
  NULL_ADDRESS,
} from 'modules/common/constants';
import { updateModal } from 'modules/modal/actions/update-modal';
import { addUpdatePendingTransaction } from 'modules/pending-queue/actions/pending-queue-management';
import { LoginAccount } from 'modules/types';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { augurSdk } from 'services/augursdk';
import logError from 'utils/log-error';
import { loadAccountDataFromLocalStorage } from './load-account-data-from-local-storage';

export const updateSdk = (
  loginAccount: Partial<LoginAccount>,
  networkId: string,
) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  const { env } = getState();
  if (!loginAccount || !loginAccount.address || !loginAccount.meta) return;
  if (!augurSdk.get()) return;

  let newAccount = { ...loginAccount };

  try {
    dispatch(updateAppStatus(Ox_ENABLED, !!augurSdk.get().zeroX));
    dispatch(loadAccountDataFromLocalStorage(newAccount.address));
    await augurSdk.syncUserData(
      newAccount.mixedCaseAddress,
      newAccount.meta.provider,
      newAccount.meta.signer,
      networkId,
      env?.ui?.primaryProvider,
    );

    dispatch(updateLoginAccount(newAccount));
    dispatch(updateAuthStatus(IS_LOGGED, true));
    dispatch(loadAccountData());
    dispatch(updateAssets());
  } catch (error) {
    logError(error);
    dispatch(
      updateModal({
        type: MODAL_ERROR,
        error,
      })
    );
  }
};

import logError from 'utils/log-error';
import { augurSdk } from 'services/augursdk';
import { LoginAccount } from 'modules/types';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { toChecksumAddress } from 'ethereumjs-util';
import {
  updateAppStatus,
  Ox_ENABLED,
  GSN_ENABLED,
  WALLET_STATUS,
} from 'modules/app/actions/update-app-status';
import { loadAccountDataFromLocalStorage } from './load-account-data-from-local-storage';
import { IS_LOGGED, updateAuthStatus } from 'modules/auth/actions/auth-status';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { NetworkId } from '@augurproject/artifacts';
import { AppState } from 'store';
import { updateModal } from 'modules/modal/actions/update-modal';
import { MODAL_ERROR, WALLET_STATUS_VALUES, CREATEAUGURWALLET } from 'modules/common/constants';
import { TXEventName } from '@augurproject/sdk';
import { addUpdatePendingTransaction } from 'modules/pending-queue/actions/pending-queue-management';

export const updateSdk = (
  loginAccount: Partial<LoginAccount>,
  networkId: string,
  useGSN: boolean
) => async (
  dispatch: ThunkDispatch<void, any, Action>,
) => {
  if (!loginAccount || !loginAccount.address || !loginAccount.meta) return;
  if (!augurSdk.sdk) return;

  let newAccount = { ...loginAccount };

  try {
    dispatch(updateAppStatus(Ox_ENABLED, !!augurSdk.sdk.zeroX));
    dispatch(updateAppStatus(GSN_ENABLED, useGSN));
    if (useGSN) {
      const hasWallet = await augurSdk.client.gsn.userHasInitializedWallet(newAccount.address);
      if (hasWallet) {
        dispatch(updateAppStatus(WALLET_STATUS, WALLET_STATUS_VALUES.CREATED));
      } else {
        dispatch(updateAppStatus(WALLET_STATUS, WALLET_STATUS_VALUES.WAITING_FOR_FUNDING));
      }
      const walletAddress = await augurSdk.client.gsn.calculateWalletAddress(
        newAccount.address
      );
      newAccount = {
        ...loginAccount,
        meta: {
          ...loginAccount.meta,
          address: toChecksumAddress(walletAddress),
        },
        mixedCaseAddress: toChecksumAddress(walletAddress),
        address: toChecksumAddress(walletAddress),
      };
    }
    dispatch(loadAccountDataFromLocalStorage(newAccount.address));
    await augurSdk.syncUserData(
      newAccount.mixedCaseAddress,
      newAccount.meta.signer,
      networkId as NetworkId,
      useGSN
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

export const createFundedGsnWallet = () => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  try {
    dispatch(addUpdatePendingTransaction(CREATEAUGURWALLET, TXEventName.Pending));
    await augurSdk.client.gsn.initializeWallet();
    dispatch(updateAppStatus(WALLET_STATUS, WALLET_STATUS_VALUES.CREATED));
  } catch (e) {
    dispatch(addUpdatePendingTransaction(CREATEAUGURWALLET, TXEventName.Failure));
    dispatch(updateAppStatus(WALLET_STATUS, WALLET_STATUS_VALUES.FUNDED_NEED_CREATE));
  }
};

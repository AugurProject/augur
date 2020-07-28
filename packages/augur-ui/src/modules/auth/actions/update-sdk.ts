import { TXEventName } from '@augurproject/sdk-lite';
import { AppState } from 'appStore';
import { toChecksumAddress } from 'ethereumjs-util';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { addAlert } from 'modules/alerts/actions/alerts';
import {
  GSN_ENABLED,
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
  useGSN: boolean
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
      newAccount.meta.provider,
      newAccount.meta.signer,
      networkId,
      useGSN,
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

export const createFundedGsnWallet = () => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  try {
    const affiliate = getState().loginAccount.affiliate;
    dispatch(addUpdatePendingTransaction(CREATEAUGURWALLET, TXEventName.Pending));

    augurSdk.client.dependencies.setReferralAddress(affiliate || NULL_ADDRESS);
    await augurSdk.client.gsn.initializeWallet();

    dispatch(updateAppStatus(WALLET_STATUS, WALLET_STATUS_VALUES.CREATED));

    const timestamp = getState().blockchain.currentAugurTimestamp * 1000;
    const alert = {
      name: CREATEAUGURWALLET,
      uniqueId: timestamp,
      toast: true,
      description: 'Your account has been activated!',
      title: 'Account activation',
      index: 0,
      timestamp,
      status: SUCCESS,
      params: {
        market: '0x0000000000000000000000000000000000000000',
      }
    }
    dispatch(addAlert(alert));
  } catch (e) {
    dispatch(addUpdatePendingTransaction(CREATEAUGURWALLET, TXEventName.Failure));
    dispatch(updateAppStatus(WALLET_STATUS, WALLET_STATUS_VALUES.FUNDED_NEED_CREATE));
  }
};

import logError from 'utils/log-error';
import { augurSdk } from 'services/augursdk';
import { LoginAccount } from 'modules/types';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { toChecksumAddress } from 'ethereumjs-util';
import {
  updateAppStatus,
  GSN_ENABLED,
  Ox_ENABLED,
} from 'modules/app/actions/update-app-status';
import { loadAccountDataFromLocalStorage } from './load-account-data-from-local-storage';
import { IS_LOGGED, updateAuthStatus } from 'modules/auth/actions/auth-status';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { NetworkId } from '@augurproject/artifacts';
import { AppState } from 'store';
import { updateModal } from 'modules/modal/actions/update-modal';
import { MODAL_ERROR } from 'modules/common/constants';

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
      const walletAddress = await augurSdk.client.gsn.calculateWalletAddress(
        loginAccount.address
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

      await augurSdk.syncUserData(
        loginAccount.mixedCaseAddress,
        loginAccount.meta.signer,
        networkId as NetworkId,
        true
      );
    }
    dispatch(loadAccountDataFromLocalStorage(newAccount.address));
    await augurSdk.syncUserData(
      newAccount.mixedCaseAddress,
      newAccount.meta.signer,
      networkId as NetworkId,
      false
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
  const { loginAccount } = getState();
  const { affiliate, address } = loginAccount;
  // TODO call new method to create wallet
  augurSdk.getOrCreateWallet(address, affiliate);
};

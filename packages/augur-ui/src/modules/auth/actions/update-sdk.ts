import logError from 'utils/log-error';
import { augurSdk } from 'services/augursdk';
import { LoginAccount } from 'modules/types';
import { toChecksumAddress } from 'ethereumjs-util';
import { loadAccountDataFromLocalStorage } from './load-account-data-from-local-storage';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { NetworkId } from '@augurproject/artifacts';
import {
  MODAL_ERROR,
  WALLET_STATUS_VALUES,
  CREATEAUGURWALLET,
  SUCCESS,
  MODAL_LOADING,
  NULL_ADDRESS,
} from 'modules/common/constants';
import { TXEventName } from '@augurproject/sdk-lite';
import { addUpdatePendingTransaction } from 'modules/pending-queue/actions/pending-queue-management';
import { addAlert } from 'modules/alerts/actions/alerts';
import { AppStatus } from 'modules/app/store/app-status';

export const updateSdk = async (
  loginAccount: Partial<LoginAccount>,
  networkId: string
) => {
  if (!loginAccount || !loginAccount.address || !loginAccount.meta) return;
  if (!augurSdk.get()) return;

  let newAccount = { ...loginAccount };
  const { env } = AppStatus.get();
  const {
    setModal,
    setGSNEnabled,
    setOxEnabled,
    setWalletStatus,
    setIsLogged,
    updateLoginAccount,
    closeModal,
  } = AppStatus.actions;
  const useGSN = env.gsn?.enabled;

  try {
    setOxEnabled(!!augurSdk.get().zeroX);
    setGSNEnabled(useGSN);
    if (useGSN) {
      const hasWallet = await augurSdk.client.gsn.userHasInitializedWallet(
        newAccount.address
      );
      setWalletStatus(
        hasWallet
          ? WALLET_STATUS_VALUES.CREATED
          : WALLET_STATUS_VALUES.WAITING_FOR_FUNDING
      );
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
    loadAccountDataFromLocalStorage(newAccount.address);
    await augurSdk.syncUserData(
      newAccount.mixedCaseAddress,
      newAccount.meta.signer,
      networkId as NetworkId,
      useGSN
    );

    updateLoginAccount(newAccount);
    setIsLogged(true);
    loadAccountData();
    updateAssets(true);
    if (AppStatus.get().modal.type === MODAL_LOADING) closeModal();
  } catch (error) {
    logError(error);
    setModal({
      type: MODAL_ERROR,
      error,
    });
  }
};

export const createFundedGsnWallet = async () => {
  const { setWalletStatus } = AppStatus.actions;
  const {
    blockchain: { currentAugurTimestamp },
    loginAccount: { affiliate },
  } = AppStatus.get();
  try {
    addUpdatePendingTransaction(CREATEAUGURWALLET, TXEventName.Pending);

    augurSdk.client.dependencies.setReferralAddress(affiliate || NULL_ADDRESS);
    await augurSdk.client.gsn.initializeWallet();

    setWalletStatus(WALLET_STATUS_VALUES.CREATED);

    const timestamp = currentAugurTimestamp * 1000;
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
      },
    };
    addAlert(alert);
  } catch (e) {
    addUpdatePendingTransaction(CREATEAUGURWALLET, TXEventName.Failure);
    setWalletStatus(WALLET_STATUS_VALUES.FUNDED_NEED_CREATE);
  }
};

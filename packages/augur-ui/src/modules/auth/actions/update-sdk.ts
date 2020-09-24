import logError from 'utils/log-error';
import { augurSdk } from 'services/augursdk';
import { LoginAccount } from 'modules/types';
import { loadAccountDataFromLocalStorage } from './load-account-data-from-local-storage';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import { updateAssets } from 'modules/auth/actions/update-assets';
import {
  MODAL_ERROR,
  MODAL_LOADING,
} from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';
import { approvalsNeededToTrade } from 'modules/contracts/actions/contractCalls';

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
    setOxEnabled,
    setIsLogged,
    updateLoginAccount,
    closeModal,
  } = AppStatus.actions;

  try {
    setOxEnabled(!!augurSdk.get().zeroX);
    loadAccountDataFromLocalStorage(newAccount.address);
    await augurSdk.syncUserData(
      newAccount.mixedCaseAddress,
      newAccount.meta.provider,
      newAccount.meta.signer,
      networkId,
      env?.ui?.primaryProvider,
    );
    updateLoginAccount(newAccount);
    const neededApprovals = await approvalsNeededToTrade(loginAccount.address);
    AppStatus.actions.updateLoginAccount({ tradingApproved: neededApprovals === 0 })
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


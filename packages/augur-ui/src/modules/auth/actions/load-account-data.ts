import { checkAccountAllowance } from 'modules/auth/actions/approve-account';
import { loadAccountHistory } from 'modules/auth/actions/load-account-history';
import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';
import { windowRef } from 'utils/window-ref';
import logError from 'utils/log-error';
import { NodeStyleCallback, WindowApp } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'appStore';
import { registerUserDefinedGasPriceFunction } from 'modules/app/actions/register-user-defined-gasPrice-function';
import { getEthToDaiRate } from 'modules/app/actions/get-ethToDai-rate';
import { getRepToDaiRate } from 'modules/app/actions/get-repToDai-rate';
import { AppStatus } from 'modules/app/store/app-status';

export const loadAccountData = (
  callback: NodeStyleCallback = logError
) => async (dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState) => {
  const { loginAccount: { meta, mixedCaseAddress: address } , universe, isLogged, isConnected, gasPriceInfo } = AppStatus.get();
  if (isConnected && isLogged) {
    if (!address) return callback('account address required');
    const windowApp = windowRef as WindowApp;
    if (
      windowApp &&
      windowApp.localStorage.setItem &&
      meta
    ) {
      const loggedInUser = {
        accountType: meta.accountType,
        address
      };
      windowApp.localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

    }
    dispatch(loadAccountHistory());
    checkAccountAllowance();
    dispatch(loadUniverseDetails(universe.id, address));
    getEthToDaiRate();
    getRepToDaiRate();
    registerUserDefinedGasPriceFunction(gasPriceInfo.userDefinedGasPrice, gasPriceInfo.average);
  }
};

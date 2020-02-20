import { loadAccountDataFromLocalStorage } from 'modules/auth/actions/load-account-data-from-local-storage';
import { checkAccountAllowance } from 'modules/auth/actions/approve-account';
import { loadAccountHistory } from 'modules/auth/actions/load-account-history';
import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';
import { windowRef } from 'utils/window-ref';
import logError from 'utils/log-error';
import { loadGasPriceInfo } from 'modules/app/actions/load-gas-price-info';
import { NodeStyleCallback, WindowApp } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'appStore';
import { getEthToDaiRate } from 'modules/app/actions/get-ethToDai-rate';
import { registerUserDefinedGasPriceFunction } from 'modules/app/actions/register-user-defined-gasPrice-function';

export const loadAccountData = (
  callback: NodeStyleCallback = logError
) => async (dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState) => {
  const { loginAccount, universe, gasPriceInfo } = getState();
  const { mixedCaseAddress: address } = loginAccount;
  if (!address) return callback('account address required');
  const windowApp = windowRef as WindowApp;
  if (
    windowApp &&
    windowApp.localStorage.setItem &&
    loginAccount &&
    loginAccount.meta
  ) {
    const loggedInUser = {
      accountType: loginAccount.meta.accountType,
      address
    };
    windowApp.localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

  }
  dispatch(loadAccountHistory());
  dispatch(checkAccountAllowance());
  dispatch(loadUniverseDetails(universe.id, address));
  dispatch(loadGasPriceInfo());
  dispatch(getEthToDaiRate());
  registerUserDefinedGasPriceFunction(gasPriceInfo.userDefinedGasPrice, gasPriceInfo.average);
};

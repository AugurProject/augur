import { loadAccountDataFromLocalStorage } from 'modules/auth/actions/load-account-data-from-local-storage';
import { checkAccountAllowance } from 'modules/auth/actions/approve-account';
import { loadAccountHistory } from 'modules/auth/actions/load-account-history';
import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';
import { windowRef } from 'utils/window-ref';
import logError from 'utils/log-error';
import { NodeStyleCallback, WindowApp } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';
import { registerUserDefinedGasPriceFunction } from 'modules/app/actions/register-user-defined-gasPrice-function';
import { getEthToDaiRate } from 'modules/app/actions/get-ethToDai-rate';

export const loadAccountData = (
  callback: NodeStyleCallback = logError
) => async (dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState) => {
  const { loginAccount, universe, gasPriceInfo, connection, authStatus } = getState();
  if (connection.isConnected && authStatus.isLogged) {
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
    dispatch(getEthToDaiRate());
    dispatch(registerUserDefinedGasPriceFunction());
  }
};

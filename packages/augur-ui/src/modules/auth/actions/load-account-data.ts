import { checkAccountApproval } from 'modules/auth/actions/approve-account';
import { loadAccountHistory } from 'modules/auth/actions/load-account-history';
import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';
import { windowRef } from 'utils/window-ref';
import logError from 'utils/log-error';
import { NodeStyleCallback, WindowApp } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'appStore';
import { registerUserDefinedGasPriceFunction } from 'modules/app/actions/register-user-defined-gasPrice-function';
import { getTradePageMarketId } from "modules/trades/helpers/get-trade-page-market-id";
import { loadMarketOrderBook } from 'modules/orders/actions/load-market-orderbook';
import { loadGasPriceInfo } from 'modules/app/actions/load-gas-price-info';
import { updateAssets } from 'modules/auth/actions/update-assets';

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
    dispatch(checkAccountApproval());
    dispatch(updateAssets());
    dispatch(loadGasPriceInfo());
    gasPriceInfo.userDefinedGasPrice && dispatch(registerUserDefinedGasPriceFunction(gasPriceInfo.userDefinedGasPrice, gasPriceInfo.average));
    const marketId = getTradePageMarketId();
    if (marketId) {
      dispatch(loadMarketOrderBook(marketId));
    }
    dispatch(loadUniverseDetails(universe.id, address));
  }
};

import { checkAccountAllowance, checkAccountApproval } from 'modules/auth/actions/approve-account';
import { loadAccountHistory } from 'modules/auth/actions/load-account-history';
import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';
import { windowRef } from 'utils/window-ref';
import logError from 'utils/log-error';
import { NodeStyleCallback, WindowApp } from 'modules/types';
import { registerUserDefinedGasPriceFunction } from 'modules/app/actions/register-user-defined-gasPrice-function';
import { AppStatus } from 'modules/app/store/app-status';
import { loadGasPriceInfo } from 'modules/app/actions/load-gas-price-info';
import { getTradePageMarketId } from 'modules/trades/helpers/get-trade-page-market-id';
import { loadMarketOrderBook } from 'modules/orders/helpers/load-market-orderbook';

export const loadAccountData = async (
  callback: NodeStyleCallback = logError
) => {
  const {
    loginAccount: { meta, mixedCaseAddress: address },
    universe,
    isLogged,
    isConnected,
    gasPriceInfo,
  } = AppStatus.get();
  if (isConnected && isLogged) {
    if (!address) return callback('account address required');
    const windowApp = windowRef as WindowApp;
    if (windowApp && windowApp.localStorage.setItem && meta) {
      const loggedInUser = {
        accountType: meta.accountType,
        address,
      };
      windowApp.localStorage.setItem(
        'loggedInUser',
        JSON.stringify(loggedInUser)
      );
    }
    loadAccountHistory();
    checkAccountApproval();
    checkAccountAllowance();
    loadGasPriceInfo();
    const marketId = getTradePageMarketId();
    if (marketId) {
      loadMarketOrderBook(marketId);
    }
    registerUserDefinedGasPriceFunction(
      gasPriceInfo.userDefinedGasPrice,
      gasPriceInfo.average
    );

    loadUniverseDetails(universe.id, address);
  }
};

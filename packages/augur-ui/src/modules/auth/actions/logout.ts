import { clearLoginAccount } from 'modules/account/actions/login-account';
import { clearUserTx } from 'modules/contracts/actions/contractCalls';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { windowRef } from 'utils/window-ref';
import { updateMobileMenuState } from 'modules/app/actions/update-sidebar-status';
import { analytics } from 'services/analytics';
import { isLocalHost } from 'utils/is-localhost';
import { augurSdk } from 'services/augursdk';
import { updateAppStatus, WALLET_STATUS, GSN_ENABLED } from 'modules/app/actions/update-app-status';
import { clearLiquidityOrders } from 'modules/orders/actions/liquidity-management';

export function logout() {
  return async (dispatch: ThunkDispatch<void, any, Action>) => {
    const localStorageRef =
      typeof window !== 'undefined' && window.localStorage;
    clearUserTx();
    if (localStorageRef && localStorageRef.removeItem) {
      localStorageRef.removeItem('airbitz.current_user');
      localStorageRef.removeItem('airbitz.users');
      localStorageRef.removeItem('loggedInUser');
    }
    dispatch(clearLoginAccount());
    dispatch(clearLiquidityOrders());

    // Close Mobile Menu
    dispatch(updateMobileMenuState(0));

    // Clean up web3 wallets
    if (windowRef.torus) {
      await windowRef.torus.cleanUp();
    }

    if (windowRef.portis) {
      await windowRef.portis.logout();
      document.querySelector('.por_portis-container').remove();
    }

    // Wallet cleanup
    if (augurSdk && augurSdk.sdk) {
      augurSdk.sdk.setUseWallet(false);
      dispatch(updateAppStatus(WALLET_STATUS, null));
    }
    dispatch(updateAppStatus(GSN_ENABLED, false));
    dispatch(updateAppStatus(WALLET_STATUS, null));


    if (!isLocalHost()) {
      analytics.reset();
    }
  };
}

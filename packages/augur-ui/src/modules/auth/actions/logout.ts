import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { windowRef } from 'utils/window-ref';
import { analytics } from 'services/analytics';
import { isLocalHost } from 'utils/is-localhost';
import { augurSdk } from 'services/augursdk';

import { AppStatus } from 'modules/app/store/app-status';
import { PendingOrders } from 'modules/app/store/pending-orders';

export function logout() {
  return async (dispatch: ThunkDispatch<void, any, Action>) => {
    const { setRestoredAccount, setIsLogged, setGSNEnabled, setWalletStatus, setMobileMenuState } = AppStatus.actions;
    const localStorageRef =
      typeof window !== 'undefined' && window.localStorage;
    if (localStorageRef && localStorageRef.removeItem) {
      localStorageRef.removeItem('airbitz.current_user');
      localStorageRef.removeItem('airbitz.users');
      localStorageRef.removeItem('loggedInUser');
    }
    AppStatus.actions.clearLoginAccount();
    PendingOrders.actions.clearLiquidity();

    // Close Mobile Menu
    setMobileMenuState(0);

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
      setWalletStatus(null);
    }
    setGSNEnabled(false);
    setWalletStatus(null);
    setIsLogged(false);
    setRestoredAccount(false);

    if (!isLocalHost()) {
      analytics.reset();
    }
  };
}

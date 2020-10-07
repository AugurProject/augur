import { windowRef } from 'utils/window-ref';
import { analytics } from 'services/analytics';
import { isLocalHost } from 'utils/is-localhost';
import { augurSdk } from 'services/augursdk';

import { AppStatus } from 'modules/app/store/app-status';
import { PendingOrders } from 'modules/app/store/pending-orders';
import { Betslip } from 'modules/trading/store/betslip';

export const logout = async () => {
  const localStorageRef =
    typeof window !== 'undefined' && window.localStorage;
  if (localStorageRef && localStorageRef.removeItem) {
    localStorageRef.removeItem('airbitz.current_user');
    localStorageRef.removeItem('airbitz.users');
    localStorageRef.removeItem('loggedInUser');
  }
  AppStatus.actions.clearLoginAccount();
  Betslip.actions.clearBetslip();
  PendingOrders.actions.clearLiquidity();

  // Clean up web3 wallets
  if (windowRef.portis) {
    await windowRef.portis.logout();
    document.querySelector('.por_portis-container').remove();
  }

  if (windowRef.torus) {
    await windowRef.torus.cleanUp();
  }
  if (windowRef.fm) {
    await windowRef.fm.user.logout();
  }
  // Wallet cleanup
  if (augurSdk && augurSdk.sdk) {
    augurSdk.sdk.setUseWallet(false);
  }
  if (!isLocalHost()) {
    analytics.reset();
  }
};

export default logout;

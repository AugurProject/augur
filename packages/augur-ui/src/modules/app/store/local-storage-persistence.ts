import { AppStatus } from "./app-status";
import { PendingOrders } from "./pending-orders";
import { WindowApp } from "modules/types";
import { windowRef } from "utils/window-ref";
import { getNetworkId } from "modules/contracts/actions/contractCalls";
import { augurSdk } from "services/augursdk";
import { processFavorites } from "modules/markets/helpers/favorites-processor";

export const handleLocalStorage = () => {
  const { drafts, analytics, alerts, notifications, favorites, loginAccount, isLogged, isConnected, env, gasPriceInfo, pendingQueue, theme, oddsType, timeFormat } = AppStatus.get();
  const { pendingOrders, pendingLiquidityOrders } = PendingOrders.get();
  if (
    !loginAccount?.address ||
    !isLogged ||
    !isConnected
  ) {
    return;
  }
  const { address, affiliate, settings, currentOnboardingStep } = loginAccount;
  const windowApp: WindowApp = windowRef as WindowApp;
  if (windowApp?.localStorage?.setItem) {
    const { localStorage } = windowApp;
    const networkIdToUse: number = isConnected
      ? parseInt(getNetworkId(), 10)
      : 1;
    let universeId = env.universe;
    const Augur = augurSdk ? augurSdk.get() : undefined;
    if (Augur) {
      universeId = Augur.contracts.universe.address;
    }
    const universeIdToUse = universeId;
    const accountValue = localStorage.getItem(address) || '{}';
    let storedAccountData = JSON.parse(accountValue);
    if (!storedAccountData || !storedAccountData.selectedUniverse) {
      storedAccountData = {
        selectedUniverse: { [networkIdToUse]: universeIdToUse },
      };
    }
    const processedFavorites = processFavorites(
      favorites,
      storedAccountData.favorites,
      networkIdToUse,
      universeIdToUse
    );

    localStorage.setItem(
      address,
      JSON.stringify({
        pendingLiquidityOrders,
        analytics,
        favorites: processedFavorites,
        alerts,
        notifications,
        pendingOrders,
        pendingQueue,
        drafts,
        gasPriceInfo: {
          userDefinedGasPrice: gasPriceInfo.userDefinedGasPrice,
        },
        selectedUniverse: {
          ...storedAccountData.selectedUniverse,
        },
        currentOnboardingStep,
        settings,
        affiliate,
        theme,
        oddsType,
        timeFormat
      })
    );
  }
};
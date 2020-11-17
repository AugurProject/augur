import { updateAlert, loadAlerts } from 'modules/alerts/actions/alerts';
import { loadPendingLiquidityOrders } from 'modules/orders/actions/liquidity-management';
import { loadPendingOrdersTransactions } from 'modules/orders/actions/pending-orders-management';
import { isNewFavoritesStyle } from 'modules/markets/helpers/favorites-processor';
import { loadPendingQueue } from 'modules/pending-queue/actions/pending-queue-management';
import { setSelectedUniverse } from './selected-universe-management';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { loadAnalytics } from 'modules/app/actions/analytics-management';
import { AppStatus } from 'modules/app/store/app-status';
import isAddress from 'modules/auth/helpers/is-address';
import { getHTMLTheme } from 'modules/app/store/app-status-hooks';
import { THEME_NAME } from 'modules/routes/constants/param-names';
import { parseLocation } from 'modules/routes/helpers/parse-query';

export const loadAccountDataFromLocalStorage = (address: string) => {
  const localStorageRef = typeof window !== 'undefined' && window.localStorage;
  const { universe, filterSortOptions } = AppStatus.get();

  if (localStorageRef && localStorageRef.getItem && address) {
    const storedAccountData = JSON.parse(localStorageRef.getItem(address));
    if (storedAccountData) {
      const {
        updateFilterSortOptions,
        updateUniverse,
        updateLoginAccount,
        loadFavorites,
        updateGasPriceInfo,
        updateNotifications,
        loadDrafts,
        setOdds,
        setTimeFormat,
        setTheme,
      } = AppStatus.actions;
      const {
        oddsType,
        timeFormat,
        settings,
        selectedUniverse,
        favorites,
        notifications,
        pendingQueue,
        affiliate,
        alerts,
        pendingLiquidityOrders,
        pendingOrders,
        gasPriceInfo,
        drafts,
        analytics,
        theme,
        currentOnboardingStep,
      } = storedAccountData;
      if (settings) {
        const filterOptions = Object.keys(settings).reduce(
          (p, key) => (settings[key] ? { ...p, [key]: settings[key] } : p),
          {}
        );
        updateFilterSortOptions({
          ...filterSortOptions,
          ...filterOptions,
        });
      }

      if (currentOnboardingStep) {
        updateLoginAccount({ currentOnboardingStep });
      }

      if (!!affiliate && isAddress(affiliate))
        updateLoginAccount({ affiliate });

      if (notifications?.length > 0) {
        updateNotifications(notifications);
      }
      const networkId = getNetworkId();
      const selectedUniverseId = selectedUniverse[networkId];
      if (selectedUniverseId) {
        if (universe.id !== selectedUniverseId) {
          updateUniverse({ id: selectedUniverseId });
        }
      } else {
        // we have a no selectedUniveres for this account, default to default universe for this network.
        setSelectedUniverse();
      }
      if (
        favorites &&
        isNewFavoritesStyle(favorites) &&
        favorites[networkId] &&
        favorites[networkId][universe.id] &&
        Object.keys(favorites[networkId][universe.id]).length > 0
      ) {
        loadFavorites(favorites[networkId][universe.id]);
      }
      if (Object.keys(drafts || {}).length > 0) {
        loadDrafts(drafts);
      }
      if (alerts) {
        loadAlerts(alerts);
        // alerts.map(n => updateAlert(n.id, n, true));
      }

      if (Object.keys(pendingLiquidityOrders || {}).length > 0) {
        loadPendingLiquidityOrders(pendingLiquidityOrders);
      }
      if (analytics) {
        loadAnalytics(analytics, 0);
      }
      if (Object.keys(pendingOrders || {}).length > 0) {
        loadPendingOrdersTransactions(pendingOrders);
      }
      if (pendingQueue) {
        loadPendingQueue(pendingQueue);
      }
      if (gasPriceInfo?.userDefinedGasPrice) {
        updateGasPriceInfo({
          userDefinedGasPrice: gasPriceInfo.userDefinedGasPrice,
        });
      }
      if (
        !parseLocation(window?.location?.href || '')[THEME_NAME] &&
        ((theme && AppStatus.get().theme !== theme) ||
          (theme && getHTMLTheme() !== theme))
      ) {
        setTheme(theme);
      }
      if (oddsType && AppStatus.get().oddsType !== oddsType) {
        setOdds(oddsType);
      }
      if (timeFormat && AppStatus.get().timeFormat !== timeFormat) {
        setTimeFormat(timeFormat);
      }
    }
  }
};

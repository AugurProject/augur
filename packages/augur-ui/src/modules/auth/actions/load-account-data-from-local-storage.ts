import { updateAlert } from 'modules/alerts/actions/alerts';
import { loadPendingLiquidityOrders } from 'modules/orders/actions/liquidity-management';
import { loadPendingOrdersTransactions } from 'modules/orders/actions/pending-orders-management';
import { isNewFavoritesStyle } from 'modules/markets/helpers/favorites-processor';
import { loadPendingQueue } from 'modules/pending-queue/actions/pending-queue-management';
import { setSelectedUniverse } from './selected-universe-management';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info';
import { loadAnalytics } from 'modules/app/actions/analytics-management';
import { AppStatus } from 'modules/app/store/app-status';
import isAddress from 'modules/auth/helpers/is-address';
import { getHTMLTheme } from 'modules/app/store/app-status-hooks';

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

      if (!!affiliate && isAddress(affiliate))
        updateLoginAccount({ affiliate });

      if (notifications) {
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
        favorites[networkId][universe.id]
      ) {
        loadFavorites(favorites[networkId][universe.id]);
      }
      if (drafts) {
        loadDrafts(drafts);
      }
      if (alerts) {
        // get all market ids and load markets then process alerts
        const marketIds = Array.from(
          new Set(
            alerts.reduce((p, alert) => {
              const marketId =
                alert.marketId ||
                (alert.params && alert.params.market) ||
                alert.params._market;
              return marketId ? [...p, marketId] : p;
            }, [])
          )
        ) as string[];
        loadMarketsInfoIfNotLoaded(marketIds, () => {
          alerts.map(n => updateAlert(n.id, n, true));
        });
      }
      if (pendingLiquidityOrders) {
        loadPendingLiquidityOrders(pendingLiquidityOrders);
      }
      if (analytics) {
        loadAnalytics(analytics, 0);
      }
      if (pendingOrders && Object.keys(pendingOrders).length > 0) {
        loadPendingOrdersTransactions(pendingOrders);
      }
      if (pendingQueue) {
        loadPendingQueue(pendingQueue);
      }
      if (gasPriceInfo && gasPriceInfo.userDefinedGasPrice) {
        updateGasPriceInfo({
          userDefinedGasPrice: gasPriceInfo.userDefinedGasPrice,
        });
      }
      if (
        (theme && AppStatus.get().theme !== theme) ||
        (theme && getHTMLTheme() !== theme)
      ) {
        setTheme(theme);
      }
      if (oddsType) {
        setOdds(oddsType);
      }
      if (timeFormat) {
        setTimeFormat(timeFormat);
      }
    }
  }
};

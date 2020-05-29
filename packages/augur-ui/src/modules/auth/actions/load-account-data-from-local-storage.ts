import { updateAlert } from 'modules/alerts/actions/alerts';
import { loadPendingLiquidityOrders } from 'modules/orders/actions/liquidity-management';
import { loadPendingOrdersTransactions } from 'modules/orders/actions/pending-orders-management';
import { isNewFavoritesStyle } from 'modules/markets/helpers/favorites-processor';
import { loadPendingQueue } from 'modules/pending-queue/actions/pending-queue-management';
import { setSelectedUniverse } from './selected-universe-management';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'appStore';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info';
import { loadAnalytics } from 'modules/app/actions/analytics-management';
import {
  MARKET_MAX_FEES,
  MARKET_MAX_SPREAD,
  MARKET_SHOW_INVALID,
} from 'modules/app/store/constants';
import { TEMPLATE_FILTER } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';
import isAddress from 'modules/auth/helpers/is-address';

export const loadAccountDataFromLocalStorage = (
  address: string
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
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
      } = AppStatus.actions;
      const { selectedUniverse } = storedAccountData;
      const { favorites } = storedAccountData;
      const { notifiations } = storedAccountData;
      const { pendingQueue } = storedAccountData;
      const { affiliate } = storedAccountData;
      const { settings } = storedAccountData;

      if (settings) {
        const { maxFee, maxLiquiditySpread, includeInvalidMarkets, templateFilter } = settings;
        updateFilterSortOptions({
          ...filterSortOptions,
          maxFee,
          maxLiquiditySpread,
          includeInvalidMarkets,
          templateFilter,
        });
      }

      if (!!affiliate && isAddress(affiliate))
        updateLoginAccount({ affiliate });

      if (notifiations) {
        updateNotifications(notifiations);
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
        loadMarketsInfoIfNotLoaded(Object.keys(favorites[networkId][universe.id]), () => {
          loadFavorites(favorites[networkId][universe.id]);
        });
      }
      const {
        alerts,
        pendingLiquidityOrders,
        pendingOrders,
        gasPriceInfo,
        drafts,
        analytics,
      } = storedAccountData;
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
        dispatch(
          loadMarketsInfoIfNotLoaded(marketIds, () => {
            alerts.map(n => updateAlert(n.id, n, true));
          })
        );
      }
      if (pendingLiquidityOrders) {
        dispatch(loadPendingLiquidityOrders(pendingLiquidityOrders));
      }
      if (analytics) {
        loadAnalytics(analytics, 0);
      }
      if (pendingOrders && Object.keys(pendingOrders).length > 0) {
        dispatch(loadPendingOrdersTransactions(pendingOrders));
      }
      if (pendingQueue) {
        dispatch(loadPendingQueue(pendingQueue));
      }
      if (gasPriceInfo && gasPriceInfo.userDefinedGasPrice) {
        updateGasPriceInfo({
          userDefinedGasPrice: gasPriceInfo.userDefinedGasPrice,
        });
      }
    }
  }
};

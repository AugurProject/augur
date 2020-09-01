import { loadFavoritesMarkets } from 'modules/markets/actions/update-favorites';
import { loadDrafts } from 'modules/create-market/actions/update-drafts';
import { ADD_ALERT } from 'modules/alerts/actions/alerts';
import { loadPendingLiquidityOrders } from 'modules/orders/actions/liquidity-management';
import { updateReadNotifications } from 'modules/notifications/actions/update-notifications';
import { loadPendingOrdersTransactions } from 'modules/orders/actions/pending-orders-management';
import { updateGasPriceInfo } from 'modules/app/actions/update-gas-price-info';
import { updateUniverse } from 'modules/universe/actions/update-universe';
import { isNewFavoritesStyle } from 'modules/markets/helpers/favorites-processor';
import { loadPendingQueue } from 'modules/pending-queue/actions/pending-queue-management';
import { setSelectedUniverse } from './selected-universe-management';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'appStore';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { loadAnalytics } from 'modules/app/actions/analytics-management';
import {
  saveAffiliateAddress, updateLoginAccount,
} from 'modules/account/actions/login-account';
import {
  updateFilterSortOptionsSettings,
} from 'modules/filter-sort/actions/update-filter-sort-options';

export const loadAccountDataFromLocalStorage = (
  address: string
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const localStorageRef = typeof window !== 'undefined' && window.localStorage;
  const { universe } = getState();
  if (localStorageRef && localStorageRef.getItem && address) {
    const storedAccountData = JSON.parse(localStorageRef.getItem(address));
    if (storedAccountData) {
      const { selectedUniverse } = storedAccountData;
      const { favorites } = storedAccountData;
      const { readNotifications } = storedAccountData;
      const { pendingQueue } = storedAccountData;
      const { affiliate } = storedAccountData;
      const { settings } = storedAccountData;
      const { currentOnboardingStep } = storedAccountData;

      if (currentOnboardingStep) {
        dispatch(updateLoginAccount({ currentOnboardingStep }));
      }

      if (settings) {
        const filterOptions = Object.keys(settings).reduce(
          (p, key) => (settings[key] ? { ...p, [key]: settings[key] } : p),
          {}
        );
        dispatch(updateFilterSortOptionsSettings(filterOptions));
      }

      if (readNotifications) {
        dispatch(updateReadNotifications(readNotifications));
      }
      const networkId = getNetworkId();
      const selectedUniverseId = selectedUniverse[networkId];
      if (selectedUniverseId) {
        if (universe.id !== selectedUniverseId) {
          dispatch(updateUniverse({ id: selectedUniverseId }));
        }
      } else {
        // we have a no selectedUniveres for this account, default to default universe for this network.
        dispatch(setSelectedUniverse());
      }
      if (
        favorites &&
        isNewFavoritesStyle(favorites) &&
        favorites[networkId] &&
        favorites[networkId][universe.id]
      ) {
        dispatch(loadFavoritesMarkets(favorites[networkId][universe.id]));
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
        dispatch(loadDrafts(drafts));
      }
      if (alerts) {
        alerts.map(alert => dispatch({ type: ADD_ALERT, data: { alert }}));
      }
      if (affiliate) dispatch(saveAffiliateAddress(affiliate));
      if (pendingLiquidityOrders) {
        dispatch(loadPendingLiquidityOrders(pendingLiquidityOrders));
      }
      if (analytics) {
        dispatch(loadAnalytics(analytics, 0));
      }
      if (pendingOrders && Object.keys(pendingOrders).length > 0) {
        dispatch(loadPendingOrdersTransactions(pendingOrders));
      }
      if (pendingQueue) {
        dispatch(loadPendingQueue(pendingQueue));
      }
      if (gasPriceInfo && gasPriceInfo.userDefinedGasPrice) {
        dispatch(
          updateGasPriceInfo({
            userDefinedGasPrice: gasPriceInfo.userDefinedGasPrice,
          })
        );
      }
    }
  }
};

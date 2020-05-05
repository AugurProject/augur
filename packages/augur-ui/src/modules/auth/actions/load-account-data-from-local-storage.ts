import { loadFavoritesMarkets } from 'modules/markets/actions/update-favorites';
import { loadDrafts } from 'modules/create-market/actions/update-drafts';
import { updateAlert } from 'modules/alerts/actions/alerts';
import { loadPendingLiquidityOrders } from 'modules/orders/actions/liquidity-management';
import { updateReadNotifications } from 'modules/notifications/actions/update-notifications';
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
  saveAffiliateAddress,
  updateLoginAccount,
} from 'modules/account/actions/login-account';
import {
  MARKET_MAX_FEES,
  MARKET_MAX_SPREAD,
  MARKET_SHOW_INVALID,
} from 'modules/app/store/constants';
import { TEMPLATE_FILTER } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';

export const loadAccountDataFromLocalStorage = (
  address: string
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const localStorageRef = typeof window !== 'undefined' && window.localStorage;
  const { universe } = AppStatus.get();
  
  if (localStorageRef && localStorageRef.getItem && address) {
    const storedAccountData = JSON.parse(localStorageRef.getItem(address));
    if (storedAccountData) {
      const { selectedUniverse } = storedAccountData;
      const { favorites } = storedAccountData;
      const { readNotifications } = storedAccountData;
      const { pendingQueue } = storedAccountData;
      const { affiliate } = storedAccountData;
      const { settings } = storedAccountData;

      if (settings) {
        dispatch(updateLoginAccount({ settings }));
        AppStatus.actions.updateLoginAccount({ settings });
        const { maxFee, spread, showInvalid, templateFilter } = settings;
        const { updateFilterSortOptions } = AppStatus.actions;
        if (maxFee) {
          updateFilterSortOptions({ [MARKET_MAX_FEES]: settings.maxFee });
        }
        if (spread) {
          updateFilterSortOptions({ [MARKET_MAX_SPREAD]: settings.spread });
        }
        if (showInvalid) {
          updateFilterSortOptions({
            [MARKET_SHOW_INVALID]: settings.showInvalid,
          });
        }
        if (templateFilter) {
          updateFilterSortOptions({
            [TEMPLATE_FILTER]: settings.templateFilter,
          });
        }
      }

      if (readNotifications) {
        dispatch(updateReadNotifications(readNotifications));
      }
      const networkId = getNetworkId();
      const selectedUniverseId = selectedUniverse[networkId];
      if (selectedUniverseId) {
        if (universe.id !== selectedUniverseId) {
          AppStatus.actions.updateUniverse({ id: selectedUniverseId });
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
            alerts.map(n => dispatch(updateAlert(n.id, n, true)));
          })
        );
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
        AppStatus.actions.updateGasPriceInfo({
          userDefinedGasPrice: gasPriceInfo.userDefinedGasPrice,
        });
      }
    }
  }
};

import { loadFavoritesMarkets } from "modules/markets/actions/update-favorites";
import { updateScalarMarketShareDenomination } from "modules/markets/actions/update-scalar-market-share-denomination";
import { updateReports } from "modules/reports/actions/update-reports";
import { addAlert } from "modules/alerts/actions/alerts";
import { loadPendingLiquidityOrders } from "modules/orders/actions/liquidity-management";
import { updateReadNotifications } from "modules/notifications/actions/update-notifications";
import { loadPendingOrders } from "modules/orders/actions/pending-orders-management";
import { updateGasPriceInfo } from "modules/app/actions/update-gas-price-info";
import { registerUserDefinedGasPriceFunction } from "modules/app/actions/register-user-defined-gasPrice-function";
import { loadUniverse } from "modules/app/actions/load-universe";
import { isNewFavoritesStyle } from "modules/markets/helpers/favorites-processor";
import { loadPendingQueue } from "modules/pending-queue/actions/pending-queue-management";
import { setSelectedUniverse } from "./selected-universe-management";

export const loadAccountDataFromLocalStorage = address => (
  dispatch,
  getState
) => {
  const localStorageRef = typeof window !== "undefined" && window.localStorage;
  const { universe, connection } = getState();
  const { augurNodeNetworkId } = connection;
  if (localStorageRef && localStorageRef.getItem && address) {
    const storedAccountData = JSON.parse(localStorageRef.getItem(address));
    if (storedAccountData) {
      const { selectedUniverse } = storedAccountData;
      const { favorites } = storedAccountData;
      const { readNotifications } = storedAccountData;
      if (readNotifications) {
        dispatch(updateReadNotifications(readNotifications));
      }
      if (selectedUniverse && selectedUniverse[augurNodeNetworkId]) {
        const selectedUniverseId = selectedUniverse[augurNodeNetworkId];
        if (universe.id !== selectedUniverseId) {
          dispatch(loadUniverse(selectedUniverseId));
        }
      } else {
        // we have a no selectedUniveres for this account, default to default universe for this network.
        dispatch(setSelectedUniverse());
      }
      if (
        favorites &&
        isNewFavoritesStyle(favorites) &&
        favorites[augurNodeNetworkId] &&
        favorites[augurNodeNetworkId][universe.id]
      ) {
        dispatch(
          loadFavoritesMarkets(favorites[augurNodeNetworkId][universe.id])
        );
      }
      if (storedAccountData.alerts) {
        storedAccountData.alerts.map(n => dispatch(addAlert(n)));
      }
      if (storedAccountData.scalarMarketsShareDenomination) {
        Object.keys(storedAccountData.scalarMarketsShareDenomination).forEach(
          marketId => {
            dispatch(
              updateScalarMarketShareDenomination(
                marketId,
                storedAccountData.scalarMarketsShareDenomination[marketId]
              )
            );
          }
        );
      }
      if (
        storedAccountData.reports &&
        Object.keys(storedAccountData.reports).length
      ) {
        dispatch(updateReports(storedAccountData.reports));
      }
      if (
        storedAccountData.pendingLiquidityOrders &&
        Object.keys(storedAccountData.pendingLiquidityOrders).length
      ) {
        dispatch(
          loadPendingLiquidityOrders(storedAccountData.pendingLiquidityOrders)
        );
      }
      if (
        storedAccountData.pendingOrders &&
        Object.keys(storedAccountData.pendingOrders).length
      ) {
        dispatch(loadPendingOrders(storedAccountData.pendingOrders));
      }
      if (
        storedAccountData.pendingQueue &&
        Object.keys(storedAccountData.pendingQueue).length
      ) {
        dispatch(loadPendingQueue(storedAccountData.pendingQueue));
      }
      if (
        storedAccountData.gasPriceInfo &&
        storedAccountData.gasPriceInfo.userDefinedGasPrice
      ) {
        dispatch(
          updateGasPriceInfo({
            userDefinedGasPrice:
              storedAccountData.gasPriceInfo.userDefinedGasPrice
          })
        );
        dispatch(registerUserDefinedGasPriceFunction());
      }
    }
  }
};

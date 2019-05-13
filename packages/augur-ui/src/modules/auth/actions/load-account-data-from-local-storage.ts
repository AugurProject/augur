import { loadFavoritesMarkets } from "modules/markets/actions/update-favorites";
import { updateScalarMarketShareDenomination } from "modules/markets/actions/update-scalar-market-share-denomination";
import { updateReports } from "modules/reports/actions/update-reports";
import { addAlert } from "modules/alerts/actions/alerts";
import { loadPendingLiquidityOrders } from "modules/orders/actions/liquidity-management";
import { updateReadNotifications } from "modules/notifications/actions/update-notifications";
import { loadPendingOrders } from "modules/orders/actions/pending-orders-management";
import { updateGasPriceInfo } from "modules/app/actions/update-gas-price-info";
import { registerUserDefinedGasPriceFunction } from "modules/app/actions/register-user-defined-gasPrice-function";
import { updateUniverse } from "modules/universe/actions/update-universe";
import { isNewFavoritesStyle } from "modules/markets/helpers/favorites-processor";
import { loadPendingQueue } from "modules/pending-queue/actions/pending-queue-management";
import { setSelectedUniverse } from "./selected-universe-management";

export const loadAccountDataFromLocalStorage = (address: String) => (
  dispatch: Function,
  getState: Function
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
      const { pendingQueue } = storedAccountData;
      if (readNotifications) {
        dispatch(updateReadNotifications(readNotifications));
      }
      if (selectedUniverse && selectedUniverse[augurNodeNetworkId]) {
        const selectedUniverseId = selectedUniverse[augurNodeNetworkId];
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
        favorites[augurNodeNetworkId] &&
        favorites[augurNodeNetworkId][universe.id]
      ) {
        dispatch(
          loadFavoritesMarkets(favorites[augurNodeNetworkId][universe.id])
        );
      }
      const {
        alerts,
        scalarMarketsShareDenomination,
        reports,
        pendingLiquidityOrders,
        pendingOrders,
        gasPriceInfo
      } = storedAccountData;
      if (alerts) {
        alerts.map(n => dispatch(addAlert(n)));
      }
      if (scalarMarketsShareDenomination) {
        Object.keys(scalarMarketsShareDenomination).forEach(
          marketId => {
            dispatch(
              updateScalarMarketShareDenomination(
                marketId,
                scalarMarketsShareDenomination[marketId]
              )
            );
          }
        );
      }
      if (
        reports
      ) {
        dispatch(updateReports(reports));
      }
      if (
        pendingLiquidityOrders
      ) {
        dispatch(
          loadPendingLiquidityOrders(pendingLiquidityOrders)
        );
      }
      if (
        pendingOrders
      ) {
        dispatch(loadPendingOrders(pendingOrders));
      }
      if (
        pendingQueue
      ) {
        dispatch(loadPendingQueue(pendingQueue));
      }
      if (
        gasPriceInfo &&
        gasPriceInfo.userDefinedGasPrice
      ) {
        dispatch(
          updateGasPriceInfo({
            userDefinedGasPrice:
              gasPriceInfo.userDefinedGasPrice
          })
        );
        dispatch(registerUserDefinedGasPriceFunction());
      }
    }
  }
};

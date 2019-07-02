import { loadFavoritesMarkets } from "modules/markets/actions/update-favorites";
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
import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "store";
import { getNetworkId } from "modules/contracts/actions/contractCalls";

export const loadAccountDataFromLocalStorage = (address: string): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const localStorageRef = typeof window !== "undefined" && window.localStorage;
  const { universe, connection } = getState();
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
      const networkId = getNetworkId();
      if (selectedUniverse) {
        const selectedUniverseId = selectedUniverse[networkId];
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
        dispatch(
          loadFavoritesMarkets(favorites[networkId][universe.id])
        );
      }
      const {
        alerts,
        pendingLiquidityOrders,
        pendingOrders,
        gasPriceInfo
      } = storedAccountData;
      if (alerts) {
        alerts.map(n => dispatch(addAlert(n)));
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

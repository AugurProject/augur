import { updateFavorites } from "modules/markets/actions/update-favorites";
import { updateScalarMarketShareDenomination } from "modules/markets/actions/update-scalar-market-share-denomination";
import { updateReports } from "modules/reports/actions/update-reports";
import { addNotification } from "modules/notifications/actions/notifications";
import { loadPendingLiquidityOrders } from "modules/orders/actions/liquidity-management";
import { updateGasPriceInfo } from "modules/app/actions/update-gas-price-info";
import { registerUserDefinedGasPriceFunction } from "modules/app/actions/register-user-defined-gasPrice-function";
import { updateUniverse } from "modules/universe/actions/update-universe";
import { loadUniverse } from "modules/app/actions/load-universe";

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
      if (selectedUniverse) {
        const selectedUniverseId = selectedUniverse[augurNodeNetworkId];
        if (universe.id !== selectedUniverseId) {
          dispatch(
            updateUniverse({
              id: selectedUniverseId
            })
          );
          dispatch(loadUniverse(selectedUniverseId));
        }
      }
      if (storedAccountData.favorites) {
        dispatch(updateFavorites(storedAccountData.favorites));
      }
      if (storedAccountData.notifications) {
        storedAccountData.notifications.map(n => dispatch(addNotification(n)));
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

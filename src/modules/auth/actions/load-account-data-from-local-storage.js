import { updateFavorites } from "modules/markets/actions/update-favorites";
import { updateScalarMarketShareDenomination } from "modules/markets/actions/update-scalar-market-share-denomination";
import { updateReports } from "modules/reports/actions/update-reports";
import { addNotification } from "modules/notifications/actions/notifications";
import { loadPendingLiquidityOrders } from "modules/orders/actions/liquidity-management";
import { updateGasPriceInfo } from "modules/app/actions/update-gas-price-info";
import { registerUserDefinedGasPriceFunction } from "modules/app/actions/register-user-defined-gasPrice-function";
import { loadUniverse } from "modules/app/actions/load-universe";
import { isNewFavoritesStyle } from "modules/markets/helpers/favorites-processor";
import { addAllMarketBanners } from "modules/markets/actions/market-banners";
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
        dispatch(updateFavorites(favorites[augurNodeNetworkId][universe.id]));
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
      if (
        storedAccountData.marketBanners &&
        storedAccountData.marketBanners.length > 0
      ) {
        dispatch(addAllMarketBanners(storedAccountData.marketBanners));
      }
    }
  }
};

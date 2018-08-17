import { updateFavorites } from 'modules/markets/actions/update-favorites'
import { updateScalarMarketShareDenomination } from 'modules/market/actions/update-scalar-market-share-denomination'
import { updateReports } from 'modules/reports/actions/update-reports'
import { addNotification } from 'modules/notifications/actions'
import { loadPendingLiquidityOrders } from 'modules/create-market/actions/liquidity-management'

export const loadAccountDataFromLocalStorage = address => (dispatch, getState) => {
  const localStorageRef = typeof window !== 'undefined' && window.localStorage
  if (localStorageRef && localStorageRef.getItem && address) {
    const storedAccountData = JSON.parse(localStorageRef.getItem(address))
    if (storedAccountData) {
      if (storedAccountData.favorites) {
        dispatch(updateFavorites(storedAccountData.favorites))
      }
      if (storedAccountData.notifications) {
        storedAccountData.notifications.map((n) => {
          // change pending we don't know what state the tx is in
          if (n.status && n.status.toLowerCase() === 'pending') {
            n.status = 'unknown'
          }
          return dispatch(addNotification(n))
        })
      }
      if (storedAccountData.scalarMarketsShareDenomination) {
        Object.keys(storedAccountData.scalarMarketsShareDenomination).forEach((marketId) => {
          dispatch(updateScalarMarketShareDenomination(marketId, storedAccountData.scalarMarketsShareDenomination[marketId]))
        })
      }
      if (storedAccountData.reports && Object.keys(storedAccountData.reports).length) {
        dispatch(updateReports(storedAccountData.reports))
      }
      if (storedAccountData.pendingLiquidityOrders && Object.keys(storedAccountData.pendingLiquidityOrders).length) {
        dispatch(loadPendingLiquidityOrders(storedAccountData.pendingLiquidityOrders))
      }
    }
  }
}

import { updateFavorites } from 'modules/markets/actions/update-favorites'
import { updateScalarMarketShareDenomination } from 'modules/market/actions/update-scalar-market-share-denomination'
import { updateReports } from 'modules/reports/actions/update-reports'
import { loadUniverse } from 'modules/app/actions/load-universe'

export const loadAccountDataFromLocalStorage = address => (dispatch, getState) => {
  const localStorageRef = typeof window !== 'undefined' && window.localStorage
  const { universe } = getState()
  if (localStorageRef && localStorageRef.getItem && address) {
    const storedAccountData = JSON.parse(localStorageRef.getItem(address))
    if (storedAccountData) {
      if (storedAccountData.favorites) {
        dispatch(updateFavorites(storedAccountData.favorites))
      }
      if (storedAccountData.scalarMarketsShareDenomination) {
        Object.keys(storedAccountData.scalarMarketsShareDenomination).forEach((marketId) => {
          dispatch(updateScalarMarketShareDenomination(marketId, storedAccountData.scalarMarketsShareDenomination[marketId]))
        })
      }
      if (storedAccountData.reports && Object.keys(storedAccountData.reports).length) {
        dispatch(updateReports(storedAccountData.reports))
      }
    }
  }
}

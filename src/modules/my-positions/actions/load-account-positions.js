import { augur } from 'services/augurjs'
import { updateAccountPositionsData } from 'modules/my-positions/actions/update-account-trades-data'
import logError from 'utils/log-error'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'

export const loadAccountPositions = (options, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  if (loginAccount.address == null || universe.id == null) return callback(null)
  augur.trading.getUserTradingPositions({ ...options, account: loginAccount.address, universe: universe.id }, (err, positions) => {
    if (err) return callback(err)
    if (positions == null) return callback(null)
    const marketIds = Array.from(new Set([...positions.reduce((p, position) => [...p, position.marketId], [])]))
    dispatch(loadMarketsInfo(marketIds, () => {
      marketIds.forEach((marketId) => {
        const marketPositionData = {}
        const marketPositions = positions.filter(position => position.marketId === marketId)
        marketPositionData[marketId] = {}
        const outcomeIds = Array.from(new Set([...marketPositions.reduce((p, position) => [...p, position.outcome], [])]))
        outcomeIds.forEach((outcomeId) => {
          marketPositionData[marketId][outcomeId] = positions.filter(position => position.marketId === marketId && position.outcome === outcomeId)
        })
        dispatch(updateAccountPositionsData(marketPositionData, marketId))
      })
      callback(null, positions)
    }))
  })
}

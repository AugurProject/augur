import { augur } from 'services/augurjs'
import { updateAccountPositionsData } from 'modules/my-positions/actions/update-account-trades-data'
import logError from 'utils/log-error'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'

export const loadAccountPositions = (options, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  if (!loginAccount.address) return callback(null)
  augur.trading.getUserTradingPositions({ ...options, account: loginAccount.address, universe: universe.id }, (err, positions) => {
    if (err) return callback(err)
    if (positions == null) return callback(null)
    const marketIDs = Array.from(new Set([...positions.reduce((p, position) => [...p, position.marketID], [])]))
    dispatch(loadMarketsInfo(marketIDs, () => {
      marketIDs.forEach((marketID) => {
        const marketPositionData = {}
        const marketPositions = positions.filter(position => position.marketID === marketID)
        marketPositionData[marketID] = {}
        const outcomeIDs = Array.from(new Set([...marketPositions.reduce((p, position) => [...p, position.outcome], [])]))
        outcomeIDs.forEach((outcomeID) => { marketPositionData[marketID][outcomeID] = positions.filter(position => position.marketID === marketID && position.outcome === outcomeID) })
        dispatch(updateAccountPositionsData(marketPositionData, marketID))
      })
      callback(null, positions)
    }))
  })
}

import async from 'async'
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
      async.forEachOfSeries(marketIDs, (marketID, id, nextID) => {
        const marketPos = []
        marketPos[marketID] = [positions.filter(position => position.marketID === marketID)]
        dispatch(updateAccountPositionsData(marketPos, marketID))
        nextID(null)
      })
      callback(null, positions)
    }))
  })
}

import { augur } from 'services/augurjs'
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info-if-not-loaded'
import { updateAccountPositionsData } from 'modules/my-positions/actions/update-account-trades-data'
import logError from 'utils/log-error'
import { updateTopBarPL } from 'modules/my-positions/actions/update-top-bar-pl'

export const loadAccountPositions = (options = {}, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount, blockchain } = getState()
  if (loginAccount.address == null || universe.id == null) return callback(null)
  augur.trading.getUserTradingPositions({ ...options, account: loginAccount.address, universe: universe.id }, (err, positions) => {
    if (err) return callback(err)
    if (positions == null) return callback(null)
    const marketIds = Array.from(new Set([...positions.reduce((p, position) => [...p, position.marketId], [])]))
    if (marketIds.length === 0) return callback(null)
    dispatch(loadMarketsInfoIfNotLoaded(marketIds, (err) => {
      if (err) return callback(err)
      marketIds.forEach((marketId) => {
        const marketPositionData = {}
        const marketPositions = positions.filter(position => position.marketId === marketId)
        marketPositionData[marketId] = {}
        const outcomeIds = Array.from(new Set([...marketPositions.reduce((p, position) => [...p, position.outcome], [])]))
        outcomeIds.forEach((outcomeId) => {
          marketPositionData[marketId][outcomeId] = positions.filter(position => position.marketId === marketId && position.outcome === outcomeId)
        })
        // make sure we have a timestamp
        const timestamp = (blockchain.currentAugurTimestamp || getState().blockchain.currentAugurTimestamp || Math.round((new Date()).getTime() / 1000))
        // finally make sure we have most up to date PL values for our positions
        augur.augurNode.submitRequest(
          'getProfitLoss',
          {
            universe: universe.id,
            account: loginAccount.address,
            startTime: 0,
            endTime: timestamp + 1,
            periodInterval: timestamp,
          },
          (err, rawPerformanceData) => {
            const { all } = rawPerformanceData
            Object.keys(marketPositionData[marketId]).reduce((acc, outcome) => {
              acc[marketId][outcome] = marketPositionData[marketId][outcome]
              if (all && all[marketId] && all[marketId][outcome] && all[marketId][outcome].length && all[marketId][outcome][0].profitLoss) {
                acc[marketId][outcome][0].realizedProfitLoss = all[marketId][outcome][0].profitLoss.realized
                acc[marketId][outcome][0].unrealizedProfitLoss = all[marketId][outcome][0].profitLoss.unrealized
              }
              return acc
            }, { [marketId]: {} })
            dispatch(updateAccountPositionsData(marketPositionData, marketId))
          },
        )
        dispatch(updateTopBarPL())
      })
      callback(null, positions)
    }))
  })
}

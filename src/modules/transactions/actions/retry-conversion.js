import { augur } from 'services/augurjs'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions'

export function loadMarketThenRetryConversion(marketID, label, log, callback) {
  return (dispatch, getState) => {
    augur.markets.getMarketsInfo({ marketIDs: [marketID] }, (err, marketsInfo) => {
      if (!marketsInfo || marketsInfo.error || !Array.isArray(marketsInfo) || !marketsInfo.length || !marketsInfo[0]) {
        if (marketsInfo && marketsInfo.error) console.error('augur.markets.getMarketsInfo:', marketsInfo)
        return callback(`[${label}] couldn't load market info for market ${marketID}: ${JSON.stringify(marketsInfo)}`)
      }
      const marketInfo = marketsInfo[0]
      dispatch(updateMarketsData({ [marketID]: marketInfo }))
      dispatch(convertLogsToTransactions(label, [log], true))
      if (callback) callback()
    })
  }
}

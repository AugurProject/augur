import { augur } from 'services/augurjs'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'
import { convertLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions'

export function loadMarketThenRetryConversion(marketID, label, log, callback) {
  return (dispatch, getState) => {
    augur.markets.getMarketInfo({ marketID }, (marketInfo) => {
      if (!marketInfo || marketInfo.error) {
        if (marketInfo && marketInfo.error) console.error('augur.markets.getMarketInfo:', marketInfo)
        return callback(`[${label}] couldn't load market info for market ${marketID}: ${JSON.stringify(log)}`)
      }
      dispatch(updateMarketsData({ [marketID]: marketInfo }))
      dispatch(convertLogsToTransactions(label, [log], true))
      if (callback) callback()
    })
  }
}

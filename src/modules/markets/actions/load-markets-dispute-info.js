import { updateMarketsDisputeInfo } from 'modules/markets/actions/update-markets-data'
import { getDisputeInfo } from 'modules/reporting/actions/get-dispute-info'
import logError from 'utils/log-error'

export const loadMarketsDisputeInfo = (marketIds, callback = logError) => (dispatch, getState) => {
  dispatch(getDisputeInfo(marketIds, (err, marketsDisputeInfoArray) => {
    if (err) return callback(err)
    if (!marketsDisputeInfoArray.length) return callback(null)
    const marketsDisputeInfo = marketsDisputeInfoArray.reduce((p, marketDisputeInfo) => ({
      ...p,
      [marketDisputeInfo.marketId]: marketDisputeInfo,
    }), {})
    dispatch(updateMarketsDisputeInfo(marketsDisputeInfo))
    callback(null)
  }))
}

import async from 'async'
import { BUY, SELL } from 'modules/transactions/constants/types'
import loadOneOutcomeBidsOrAsks from 'modules/bids-asks/actions/load-one-outcome-bids-or-asks'
import logError from 'utils/log-error'

const loadOneOutcomeBidsAsks = (marketID, outcome, callback = logError) => (dispatch) => {
  if (marketID == null || outcome == null) {
    return callback(`must specify market ID and outcome: ${marketID} ${outcome}`)
  }
  async.eachSeries([BUY, SELL], (orderTypeLabel, nextOrderTypeLabel) => {
    dispatch(loadOneOutcomeBidsOrAsks(marketID, outcome, orderTypeLabel, nextOrderTypeLabel))
  }, callback)
}

export default loadOneOutcomeBidsAsks

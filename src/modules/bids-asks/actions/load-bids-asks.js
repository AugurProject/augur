import async from 'async'
import loadOneOutcomeBidsAsks from 'modules/bids-asks/actions/load-one-outcome-bids-asks'
import logError from 'utils/log-error'

const loadBidsAsks = (marketID, callback = logError) => (dispatch, getState) => {
  const { marketsData } = getState()
  console.log('marketsData in loadBidsAsks', marketsData, marketID)
  if (marketID == null) {
    return callback(`must specify market ID: ${marketID}`)
  }
  const market = marketsData[marketID]
  if (!market) {
    return callback(`market ${marketID} data not found`)
  }
  if (market.numOutcomes == null) {
    return callback(`market ${marketID} numOutcomes not found`)
  }
  const outcomes = Array.from(new Array(market.numOutcomes), (_, i) => i + 1)
  async.eachSeries(outcomes, (outcome, nextOutcome) => {
    dispatch(loadOneOutcomeBidsAsks(marketID, outcome, nextOutcome))
  }, callback)
}

export default loadBidsAsks

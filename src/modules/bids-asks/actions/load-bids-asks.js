import async from 'async'
import loadOneOutcomeBidsAsks from 'modules/bids-asks/actions/load-one-outcome-bids-asks'
import logError from 'utils/log-error'

const loadBidsAsks = (marketId, callback = logError) => (dispatch, getState) => {
  const { marketsData } = getState()
  if (marketId == null) return callback(`must specify market ID: ${marketId}`)
  const market = marketsData[marketId]
  if (!market) return callback(`market ${marketId} data not found`)
  if (market.numOutcomes == null) return callback(`market ${marketId} numOutcomes not found`)
  const outcomes = Array.from(new Array(market.numOutcomes), (_, i) => i)
  async.eachSeries(outcomes, (outcome, nextOutcome) => dispatch(loadOneOutcomeBidsAsks(marketId, outcome, nextOutcome)), callback)
}

export default loadBidsAsks

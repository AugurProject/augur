import { augur, constants } from 'services/augurjs'
import logError from 'src/utils/log-error'
import { loadMarketsInfoIfNotLoaded } from 'src/modules/markets/actions/load-markets-info-if-not-loaded'

import updateAwaitingDisputeMarkets from 'src/modules/reporting/actions/update-awaiting-dispute'
import updateCrowdDisputeMarkets from 'src/modules/reporting/actions/update-crowd-dispute'

export const loadDisputing = (callback = logError) => (dispatch, getState) => {
  const { universe } = getState()
  const args = {
    universe: universe.id,
  }

  augur.augurNode.submitRequest(
    'getMarkets',
    {
      reportingState: constants.REPORTING_STATE.CROWDSOURCING_DISPUTE,
      sortBy: 'endDate',
      ...args,
    },
    (err, result) => {
      if (err) return callback(err)

      // Load the associated market data
      dispatch(loadMarketsInfoIfNotLoaded(result))

      dispatch(updateCrowdDisputeMarkets(result))
    },
  )

  augur.augurNode.submitRequest(
    'getMarkets',
    {
      reportingState: constants.REPORTING_STATE.AWAITING_NEXT_WINDOW,
      sortBy: 'endDate',
      ...args,
    },
    (err, result) => {
      if (err) return callback(err)

      // Load the associated market data
      dispatch(loadMarketsInfoIfNotLoaded(result))

      dispatch(updateAwaitingDisputeMarkets(result))
    },
  )
}

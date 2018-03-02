import { augur, constants } from 'services/augurjs'
import logError from 'src/utils/log-error'
import { loadMarketsInfo } from 'src/modules/markets/actions/load-markets-info'

import updateDesignatedReportingMarkets from 'src/modules/reporting/actions/update-designated-reporting'
import updateUpcomingDesignatedReportingMarkets from './update-upcoming-designated-reporting'
import updateOpenMarkets from './update-open-reporting'

export const loadReporting = (callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  const args = {
    universe: universe.id,
    designatedReporter: loginAccount.address,
  }

  augur.augurNode.submitRequest(
    'getMarkets',
    {
      reportingState: constants.REPORTING_STATE.PRE_REPORTING,
      sortBy: 'endDate',
      ...args,
    },
    (err, result) => {
      if (err) return callback(err)

      // Load the associated market data
      loadMarketsInfo(result)(dispatch, getState)

      dispatch(updateUpcomingDesignatedReportingMarkets(result))
    },
  )

  augur.augurNode.submitRequest(
    'getMarkets',
    {
      reportingState: constants.REPORTING_STATE.DESIGNATED_REPORTING,
      sortBy: 'endDate',
      ...args,
    },
    (err, result) => {
      if (err) return callback(err)

      // Load the associated market data
      loadMarketsInfo(result)(dispatch, getState)

      dispatch(updateDesignatedReportingMarkets(result))
    },
  )

  augur.augurNode.submitRequest(
    'getMarkets',
    {
      reportingState: constants.REPORTING_STATE.OPEN_REPORTING,
      sortBy: 'endDate',
      ...args,
    },
    (err, result) => {
      if (err) return callback(err)

      // Load the associated market data
      loadMarketsInfo(result)(dispatch, getState)

      dispatch(updateOpenMarkets(result))
    },
  )
}

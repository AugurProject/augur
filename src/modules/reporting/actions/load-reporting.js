import { augur, constants } from 'services/augurjs'
import logError from 'utils/log-error'
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info-if-not-loaded'

import updateDesignatedReportingMarkets from 'modules/reporting/actions/update-designated-reporting'
import updateUpcomingDesignatedReportingMarkets from 'modules/reporting/actions/update-upcoming-designated-reporting'
import updateOpenMarkets from 'modules/reporting/actions/update-open-reporting'
import updateResolvedMarkets from 'modules/reporting/actions/update-resolved-reporting'

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
      sortBy: 'endTime',
      ...args,
    },
    (err, marketIds) => {
      if (err) return callback(err)
      if (!marketIds || marketIds.length === 0) return callback(null)

      dispatch(loadMarketsInfoIfNotLoaded(marketIds, (err, marketData) => {
        if (err) return console.error(err)
        dispatch(updateUpcomingDesignatedReportingMarkets(marketIds))
      }))
    },
  )

  augur.augurNode.submitRequest(
    'getMarkets',
    {
      reportingState: constants.REPORTING_STATE.DESIGNATED_REPORTING,
      sortBy: 'endTime',
      ...args,
    },
    (err, marketIds) => {
      if (err) return callback(err)
      if (!marketIds || marketIds.length === 0) return callback(null)

      dispatch(loadMarketsInfoIfNotLoaded(marketIds, (err, marketData) => {
        if (err) return console.error(err)
        dispatch(updateDesignatedReportingMarkets(marketIds))
      }))
    },
  )

  augur.augurNode.submitRequest(
    'getMarkets',
    {
      reportingState: constants.REPORTING_STATE.OPEN_REPORTING,
      sortBy: 'endTime',
      ...args,
    },
    (err, marketIds) => {
      if (err) return callback(err)
      if (!marketIds || marketIds.length === 0) return callback(null)

      dispatch(loadMarketsInfoIfNotLoaded(marketIds, (err, marketData) => {
        if (err) return console.error(err)
        dispatch(updateOpenMarkets(marketIds))
      }))
    },
  )

  augur.augurNode.submitRequest(
    'getMarkets',
    {
      reportingState: constants.REPORTING_STATE.FINALIZED,
      sortBy: 'endTime',
      ...args,
    },
    (err, marketIds) => {
      if (err) return callback(err)
      if (!marketIds || marketIds.length === 0) return callback(null)

      dispatch(loadMarketsInfoIfNotLoaded(marketIds, (err, marketData) => {
        if (err) return console.error(err)
        dispatch(updateResolvedMarkets(marketIds))
      }))
    },
  )
}

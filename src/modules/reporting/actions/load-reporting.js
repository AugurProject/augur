import { augur, constants } from 'services/augurjs'
import logError from 'utils/log-error'
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info-if-not-loaded'

import updateDesignatedReportingMarkets from 'modules/reporting/actions/update-designated-reporting'
import updateUpcomingDesignatedReportingMarkets from 'modules/reporting/actions/update-upcoming-designated-reporting'
import updateOpenMarkets from 'modules/reporting/actions/update-open-reporting'
import updateResolvedMarkets from 'modules/reporting/actions/update-resolved-reporting'

export const loadReporting = (callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  const designatedReportingParams = {
    universe: universe.id,
    designatedReporter: loginAccount.address,
  }

  augur.augurNode.submitRequest(
    'getMarkets',
    {
      reportingState: constants.REPORTING_STATE.PRE_REPORTING,
      sortBy: 'endTime',
      ...designatedReportingParams,
    },
    (err, marketIds) => {
      if (err) return callback(err)
      if (!marketIds || marketIds.length === 0) {
        dispatch(updateUpcomingDesignatedReportingMarkets([]))
        return callback(null)
      }

      dispatch(loadMarketsInfoIfNotLoaded(marketIds, (err, marketData) => {
        if (err) return logError(err)
        dispatch(updateUpcomingDesignatedReportingMarkets(marketIds))
      }))
    },
  )

  augur.augurNode.submitRequest(
    'getMarkets',
    {
      reportingState: constants.REPORTING_STATE.DESIGNATED_REPORTING,
      sortBy: 'endTime',
      ...designatedReportingParams,
    },
    (err, marketIds) => {
      if (err) return callback(err)
      if (!marketIds || marketIds.length === 0) {
        dispatch(updateDesignatedReportingMarkets([]))
        return callback(null)
      }
      dispatch(loadMarketsInfoIfNotLoaded(marketIds, (err, marketData) => {
        if (err) return logError(err)
        dispatch(updateDesignatedReportingMarkets(marketIds))
      }))
    },
  )

  augur.augurNode.submitRequest(
    'getMarkets',
    {
      reportingState: constants.REPORTING_STATE.OPEN_REPORTING,
      sortBy: 'endTime',
      universe: universe.id,
    },
    (err, marketIds) => {
      if (err) return callback(err)
      if (!marketIds || marketIds.length === 0) {
        dispatch(updateOpenMarkets([]))
        return callback(null)
      }

      dispatch(loadMarketsInfoIfNotLoaded(marketIds, (err, marketData) => {
        if (err) return logError(err)
        dispatch(updateOpenMarkets(marketIds))
      }))
    },
  )

  augur.augurNode.submitRequest(
    'getMarkets',
    {
      reportingState: constants.REPORTING_STATE.FINALIZED,
      sortBy: 'finalizationBlockNumber',
      isSortDescending: true,
      universe: universe.id,
    },
    (err, finalizedMarketIds) => {
      if (err) return callback(err)

      augur.augurNode.submitRequest(
        'getMarkets',
        {
          reportingState: constants.REPORTING_STATE.AWAITING_FINALIZATION,
          sortBy: 'endTime',
          isSortDescending: true,
          universe: universe.id,
        },
        (err, awaitingFinalizationMarketIds) => {
          if (err) return callback(err)

          const marketIds = awaitingFinalizationMarketIds.concat(finalizedMarketIds)
          if (!marketIds || marketIds.length === 0) {
            dispatch(updateResolvedMarkets([]))
            return callback(null)
          }

          dispatch(loadMarketsInfoIfNotLoaded(marketIds, (err, marketData) => {
            if (err) return logError(err)
            dispatch(updateResolvedMarkets(marketIds))
          }))
        },
      )
    },
  )
}

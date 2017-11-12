import async from 'async'
import BigNumber from 'bignumber.js'
import { augur } from 'services/augurjs'
import { updateUniverse } from 'modules/universe/actions/update-universe'
import syncUniverse from 'modules/universe/actions/sync-universe'
import getReportingCycle from 'modules/universe/selectors/reporting-cycle'
import { syncBlockchain } from 'modules/app/actions/sync-blockchain'
import { listenToUpdates } from 'modules/app/actions/listen-to-updates'
import loadTopics from 'modules/topics/actions/load-topics'
import { loadMarketsToReportOn } from 'modules/reports/actions/load-markets-to-report-on'
import logError from 'utils/log-error'

export const loadUniverse = (universeID, callback = logError) => (dispatch, getState) => {
  const universePayload = { tx: { to: universeID } }
  // NOTE: Temporarily added below dispatch so we atleast get universe ID set because the async calls below are going to fail without contracts...
  dispatch(updateUniverse({ id: universeID }))
  async.parallel({
    reputationTokenAddress: (next) => {
      augur.api.Universe.getReputationToken(universePayload, (err, reputationTokenAddress) => {
        if (err) return next(err)
        next(null, reputationTokenAddress)
      })
    },
    reportingPeriodDurationInSeconds: (next) => {
      augur.api.Universe.getReportingPeriodDurationInSeconds(universePayload, (err, reportingPeriodDurationInSeconds) => {
        if (err) return next(err)
        next(null, new BigNumber(reportingPeriodDurationInSeconds, 16).toFixed())
      })
    }
  }, (err, staticUniverseData) => {
    if (err) return callback(err)
    dispatch(updateUniverse({ ...staticUniverseData, id: universeID }))
    dispatch(updateUniverse(getReportingCycle()))
    dispatch(syncBlockchain())
    dispatch(syncUniverse((err) => {
      if (err) return callback(err)
      dispatch(listenToUpdates())
      callback(null)
    }))
    dispatch(loadTopics())
    dispatch(loadMarketsToReportOn())
  })
}

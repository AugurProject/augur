import async from 'async'
import { createBigNumber } from 'utils/create-big-number'
import { augur } from 'services/augurjs'
import { updateUniverse } from 'modules/universe/actions/update-universe'
import syncUniverse from 'modules/universe/actions/sync-universe'
import getReportingCycle from 'modules/universe/selectors/reporting-cycle'
import { syncBlockchain } from 'modules/app/actions/sync-blockchain'
import { listenToUpdates } from 'modules/events/actions/listen-to-updates'
import loadCategories from 'modules/categories/actions/load-categories'
import { loadMarketsToReportOn } from 'modules/reports/actions/load-markets-to-report-on'
import logError from 'utils/log-error'

export const loadUniverse = (universeId, history, callback = logError) => (dispatch, getState) => {
  const universePayload = { tx: { to: universeId } }
  // NOTE: Temporarily added below dispatch so we atleast get universe ID set because the async calls below are going to fail without contracts...
  dispatch(updateUniverse({ id: universeId }))
  async.parallel({
    reputationTokenAddress: (next) => {
      augur.api.Universe.getReputationToken(universePayload, (err, reputationTokenAddress) => {
        if (err) return next(err)
        next(null, reputationTokenAddress)
      })
    },
    disputeRoundDurationInSeconds: (next) => {
      augur.api.Universe.getDisputeRoundDurationInSeconds(universePayload, (err, disputeRoundDurationInSeconds) => {
        if (err) return next(err)
        next(null, createBigNumber(disputeRoundDurationInSeconds, 16).toFixed())
      })
    },
  }, (err, staticUniverseData) => {
    if (err) return callback(err)
    dispatch(updateUniverse({ ...staticUniverseData, id: universeId }))
    dispatch(updateUniverse(getReportingCycle()))
    dispatch(syncBlockchain())
    dispatch(syncUniverse((err) => {
      if (err) return callback(err)
      dispatch(listenToUpdates(history))
      callback(null)
    }))
    dispatch(loadCategories())
    dispatch(loadMarketsToReportOn())
  })
}

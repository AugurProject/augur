import async from 'async'
import { augur } from 'services/augurjs'
import getReportingCycle from 'modules/universe/selectors/reporting-cycle'
import { updateUniverse } from 'modules/universe/actions/update-universe'
import { updateAssets } from 'modules/auth/actions/update-assets'
import claimProceeds from 'modules/my-positions/actions/claim-proceeds'
import logError from 'utils/log-error'

// Synchronize front-end universe state with blockchain universe state.
const syncUniverse = (callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  if (!universe.reportingPeriodDurationInSeconds) return callback(null)
  dispatch(updateUniverse(getReportingCycle()))
  if (universe.currentReportingWindowAddress && !loginAccount.address) {
    return callback(null)
  }
  console.log('syncing universe...')
  const universePayload = { tx: { to: universe.id } }
  async.parallel({
    currentReportingWindowAddress: (next) => {
      augur.api.Universe.getCurrentReportingWindow(universePayload, (err, currentReportingWindowAddress) => {
        if (err) return next(err)
        next(null, currentReportingWindowAddress)
      })
    },
    nextReportingWindowAddress: (next) => {
      augur.api.Universe.getNextReportingWindow(universePayload, (err, nextReportingWindowAddress) => {
        if (err) return next(err)
        next(null, nextReportingWindowAddress)
      })
    }
  }, (err, universeReportingWindowData) => {
    if (err) return callback(err)
    dispatch(updateUniverse(universeReportingWindowData))
    // TODO skip if not registered
    // TODO log scan for limited reporter markets
    if (!loginAccount.address) return callback(null)
    dispatch(updateAssets((err, balances) => {
      if (err) return callback(err)
      dispatch(claimProceeds())
      callback(null)
    }))
  })
}

export default syncUniverse

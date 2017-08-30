import async from 'async'
import { augur } from 'services/augurjs'
import getReportingCycle from 'modules/branch/selectors/reporting-cycle'
import { updateBranch } from 'modules/branch/actions/update-branch'
import { updateAssets } from 'modules/auth/actions/update-assets'
import claimProceeds from 'modules/my-positions/actions/claim-proceeds'
import logError from 'utils/log-error'

// Synchronize front-end branch state with blockchain branch state.
const syncBranch = (callback = logError) => (dispatch, getState) => {
  const { branch, loginAccount } = getState()
  if (!branch.reportingPeriodDurationInSeconds) return callback(null)
  dispatch(updateBranch(getReportingCycle()))
  if (branch.currentReportingWindowAddress && !loginAccount.address) {
    return callback(null)
  }
  console.log('syncing branch...')
  const branchPayload = { tx: { to: branch.id } }
  async.parallel({
    currentReportingWindowAddress: (next) => {
      augur.api.Branch.getCurrentReportingWindow(branchPayload, (err, currentReportingWindowAddress) => {
        if (err) return next(err)
        next(null, currentReportingWindowAddress)
      })
    },
    nextReportingWindowAddress: (next) => {
      augur.api.Branch.getNextReportingWindow(branchPayload, (err, nextReportingWindowAddress) => {
        if (err) return next(err)
        next(null, nextReportingWindowAddress)
      })
    }
  }, (err, branchReportingWindowData) => {
    if (err) return callback(err)
    dispatch(updateBranch(branchReportingWindowData))
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

export default syncBranch

import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { updateReportingWindowStats } from 'modules/reporting/actions/update-reporting-window-stats'

export const loadReportingWindowBounds = (callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  augur.augurNode.submitRequest(
    'getFeeWindowCurrent',
    {
      universe: universe.id,
      reporter: loginAccount.address,
    }, (err, result) => {
      if (err) return callback(err)

      dispatch(updateReportingWindowStats({
        startTime: (result || {}).startTime,
        endTime: (result || {}).endTime,
        stake: (result || {}).totalStake || 0,
        contributions: (result || {}).participantContributions || 0,
        participation: (result || {}).participationTokens || 0,
      }))
    },
  )
}

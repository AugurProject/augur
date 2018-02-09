import { augur } from 'services/augurjs'
import { updateReportingWindowStats } from 'modules/reporting/actions/update-reporting-window-stats'

export const loadReportingWindowBounds = () => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  augur.augurNode.submitRequest(
    'getFeeWindowCurrent',
    {
      universe: universe.id,
      reporter: loginAccount.address
    }, (err, result) => {
      if (err) return

      dispatch(updateReportingWindowStats({
        startTime: result.startTime,
        endTime: result.endTime,
        stake: result.totalStake
      }))
    }
  )
}

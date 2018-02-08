import { augur } from 'services/augurjs'
import { updateReportingWindowStats } from 'modules/reporting/actions/update-reporting-window-stats'

export const loadReportingWindowBounds = () => (dispatch, getState) => {
  const { universe, loginAccount } = getState()

  augur.api.Universe.getCurrentFeeWindow({ universe: universe.id }, (err, reportingWindow) => {
    if (err) return

    augur.api.FeeWindow.getStartTime({ tx: { to: reportingWindow } }, (err, startTime) => {
      if (err) return
      dispatch(updateReportingWindowStats({ startTime }))
    })

    augur.api.FeeWindow.getEndTime({ tx: { to: reportingWindow } }, (err, endTime) => {
      if (err) return
      dispatch(updateReportingWindowStats({ endTime }))
    })

    augur.augurNode.submitRequest(
      'getFeeWindowCurrent',
      {
        universe: universe.id,
        reporter: loginAccount.address
      }, (err, result) => {
        if (err) return

        dispatch(updateReportingWindowStats({ stake: result.totalStake }))
      }
    )
  })
}

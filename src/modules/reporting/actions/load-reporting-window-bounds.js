import { augur } from 'services/augurjs'
import { updateReportingWindowStats } from 'modules/reporting/actions/update-reporting-window-stats'

export const loadReportingWindowBounds = () => (dispatch, getState) => {
  const { universe, loginAccount } = getState()

  augur.api.Universe.getCurrentReportingWindow({ universe: universe.id }, (err, reportingWindow) => {
    if (err) return

    augur.api.ReportingWindow.getStartTime({ tx: { to: reportingWindow } }, (err, startTime) => {
      if (err) return
      dispatch(updateReportingWindowStats({ startTime }))
    })

    augur.api.ReportingWindow.getEndTime({ tx: { to: reportingWindow } }, (err, endTime) => {
      if (err) return
      dispatch(updateReportingWindowStats({ endTime }))
    })

    augur.augurNode.submitRequest(
      'getStakeTokens',
      {
        universe: universe.id,
        account: loginAccount.address,
        stakeTokenState: 'UNCLAIMED'
      }, (err, tokens) => {
        if (err) return

        const stake = Object.keys(tokens).reduce((p, tokenID) => p + tokens.tokenID.amountStaked, 0)

        dispatch(updateReportingWindowStats({ stake }))
      }
    )
  })
}

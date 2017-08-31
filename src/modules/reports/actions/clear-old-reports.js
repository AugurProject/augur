export const CLEAR_OLD_REPORTS = 'CLEAR_OLD_REPORTS'

export const clearOldReports = () => (dispatch, getState) => {
  const { branch } = getState()
  dispatch({
    type: CLEAR_OLD_REPORTS,
    branchID: branch.id,
    reportPeriod: branch.reportPeriod
  })
}

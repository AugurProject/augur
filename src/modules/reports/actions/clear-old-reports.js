export const CLEAR_OLD_REPORTS = 'CLEAR_OLD_REPORTS'

export const clearOldReports = () => (dispatch, getState) => {
  const { universe } = getState()
  dispatch({
    type: CLEAR_OLD_REPORTS,
    universeId: universe.id,
    currentReportingWindowAddress: universe.currentReportingWindowAddress,
  })
}

export const UPDATE_REPORTS = 'UPDATE_REPORTS'
export const UPDATE_REPORT = 'UPDATE_REPORT'

export const updateReports = reports => ({ type: UPDATE_REPORTS, reports })
export const updateReport = (universeId, marketId, report) => ({
  type: UPDATE_REPORT, universeId, marketId, report,
})

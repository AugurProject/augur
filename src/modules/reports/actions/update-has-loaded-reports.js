export const UPDATE_HAS_LOADED_REPORTS = 'UPDATE_HAS_LOADED_REPORTS'
export const UPDATE_HAS_LOADED_MARKETS_TO_REPORT_ON = 'UPDATE_HAS_LOADED_MARKETS_TO_REPORT_ON'

export const updateHasLoadedReports = hasLoadedReports => ({ type: UPDATE_HAS_LOADED_REPORTS, hasLoadedReports })
export const updateHasLoadedMarketsToReportOn = hasLoadedMarketsToReportOn => ({ type: UPDATE_HAS_LOADED_MARKETS_TO_REPORT_ON, hasLoadedMarketsToReportOn })

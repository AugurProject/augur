import { UPDATE_HAS_LOADED_REPORTS, UPDATE_HAS_LOADED_MARKETS_TO_REPORT_ON } from 'modules/reports/actions/update-has-loaded-reports'

export default function (hasLoadedReports = { reports: false, marketsToReportOn: false }, action) {
  switch (action.type) {
    case UPDATE_HAS_LOADED_REPORTS:
      return {
        ...hasLoadedReports,
        reports: action.hasLoadedReports
      }
    case UPDATE_HAS_LOADED_MARKETS_TO_REPORT_ON:
      return {
        ...hasLoadedReports,
        marketsToReportOn: action.hasLoadedMarketsToReportOn
      }
    default:
      return hasLoadedReports
  }
}

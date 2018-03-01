import { UPDATE_HAS_LOADED_REPORTS, UPDATE_HAS_LOADED_MARKETS_TO_REPORT_ON } from 'modules/reports/actions/update-has-loaded-reports'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = { reports: false, marketsToReportOn: false }

export default function (hasLoadedReports = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_HAS_LOADED_REPORTS:
      return {
        ...hasLoadedReports,
        reports: action.hasLoadedReports,
      }
    case UPDATE_HAS_LOADED_MARKETS_TO_REPORT_ON:
      return {
        ...hasLoadedReports,
        marketsToReportOn: action.hasLoadedMarketsToReportOn,
      }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return hasLoadedReports
  }
}

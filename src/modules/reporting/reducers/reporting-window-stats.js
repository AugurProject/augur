import { UPDATE_REPORTING_WINDOW_STATS } from 'modules/reporting/actions/update-reporting-window-stats'

const DEFAULT_STATE = {
  startTime: null,
  endTime: null,
  stake: null
}

export default function (reportingWindowStats = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_REPORTING_WINDOW_STATS:
      return {
        ...reportingWindowStats,
        ...action.data
      }
    default:
      return reportingWindowStats
  }
}

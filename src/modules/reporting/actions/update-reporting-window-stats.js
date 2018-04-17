export const UPDATE_REPORTING_WINDOW_STATS = 'UPDATE_REPORTING_WINDOW_STATS'

export function updateReportingWindowStats(windowStats) {
  return {
    type: UPDATE_REPORTING_WINDOW_STATS,
    data: {
      ...windowStats,
    },
  }
}

import { UPDATE_REPORTS, UPDATE_REPORT } from 'modules/reports/actions/update-reports'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (reports = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_REPORTS: {
      const updatedReports = { ...reports }
      const universeIds = Object.keys(action.reports)
      const numUniverseIds = universeIds.length
      for (let i = 0; i < numUniverseIds; ++i) {
        updatedReports[universeIds[i]] = {
          ...reports[universeIds[i]],
          ...action.reports[universeIds[i]],
        }
      }
      return updatedReports
    }
    case UPDATE_REPORT: {
      const universeReports = reports[action.universeId] || {}
      return {
        ...reports,
        [action.universeId]: {
          ...universeReports,
          [action.marketId]: {
            ...(universeReports[action.marketId] || { marketId: action.marketId }),
            ...action.report,
          },
        },
      }
    }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return reports
  }
}

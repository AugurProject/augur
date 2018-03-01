import { UPDATE_REPORTS, UPDATE_REPORT, CLEAR_REPORTS } from 'modules/reports/actions/update-reports'
import { CLEAR_OLD_REPORTS } from 'modules/reports/actions/clear-old-reports'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (reports = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_REPORTS: {
      let universeId
      const updatedReports = Object.assign({}, reports)
      const universeIds = Object.keys(action.reports)
      const numUniverseIds = universeIds.length
      for (let i = 0; i < numUniverseIds; ++i) {
        universeId = universeIds[i]
        updatedReports[universeId] = Object.assign({}, reports[universeId], action.reports[universeId])
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
    case CLEAR_OLD_REPORTS: {
      const universeReports = reports[action.universeId] || {}
      return {
        ...reports,
        [action.universeId]: Object.keys(universeReports).reduce((p, marketId) => {
          if (universeReports[marketId].period >= action.currentReportingWindowAddress) {
            p[marketId] = universeReports[marketId]
          }
          return p
        }, {}),
      }
    }
    case RESET_STATE:
    case CLEAR_REPORTS:
      return DEFAULT_STATE
    default:
      return reports
  }
}

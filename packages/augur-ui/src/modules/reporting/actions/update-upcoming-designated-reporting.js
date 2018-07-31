export const UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS = 'UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS'

/**
 *
 * @param {string[]} marketIds
 * @returns {{type: string, data: string[]}}
 */
export default function updateUpcomingDesignatedReportingMarkets(marketIds) {
  return {
    type: UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS,
    data: marketIds,
  }
}

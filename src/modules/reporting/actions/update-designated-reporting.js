export const UPDATE_DESIGNATED_REPORTING_MARKETS = 'UPDATE_DESIGNATED_REPORTING_MARKETS'

/**
 *
 * @param {string[]} marketIds
 * @returns {{type: string, data: string[]}}
 */
export default function updateDesignatedReportingMarkets(marketIds) {
  return {
    type: UPDATE_DESIGNATED_REPORTING_MARKETS,
    data: marketIds,
  }
}

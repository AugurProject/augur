export const UPDATE_RESOLVED_REPORTING_MARKETS = 'UPDATE_RESOLVED_REPORTING_MARKETS'

/**
 *
 * @param {string[]} marketIds
 * @returns {{type: string, data: string[]}}
 */
export default function updateResolvedMarkets(marketIds) {
  return {
    type: UPDATE_RESOLVED_REPORTING_MARKETS,
    data: marketIds,
  }
}

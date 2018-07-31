export const UPDATE_OPEN_REPORTING_MARKETS = 'UPDATE_OPEN_REPORTING_MARKETS'

/**
 *
 * @param {string[]} marketIds
 * @returns {{type: string, data: string[]}}
 */
export default function updateOpenMarkets(marketIds) {
  return {
    type: UPDATE_OPEN_REPORTING_MARKETS,
    data: marketIds,
  }
}

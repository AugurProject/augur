export const UPDATE_CROWD_DISPUTE_MARKETS = 'UPDATE_CROWD_DISPUTE_MARKETS'

/**
 *
 * @param {string[]} marketIds
 * @returns {{type: string, data: string[]}}
 */
export default function updateCrowdDisputeMarkets(marketIds) {
  return {
    type: UPDATE_CROWD_DISPUTE_MARKETS,
    data: marketIds,
  }
}

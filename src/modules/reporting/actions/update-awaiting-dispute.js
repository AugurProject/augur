export const UPDATE_AWAITING_DISPUTE_MARKETS = 'UPDATE_AWAITING_DISPUTE_MARKETS'

/**
 *
 * @param {string[]} marketIds
 * @returns {{type: string, data: string[]}}
 */
export default function updateAwaitingDisputeMarkets(marketIds) {
  return {
    type: UPDATE_AWAITING_DISPUTE_MARKETS,
    data: marketIds,
  }
}

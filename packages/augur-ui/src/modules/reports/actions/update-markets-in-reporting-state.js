export const UPDATE_DESIGNATED_REPORTING_MARKETS =
  "UPDATE_DESIGNATED_REPORTING_MARKETS";
export const UPDATE_CROWD_DISPUTE_MARKETS = "UPDATE_CROWD_DISPUTE_MARKETS";
export const UPDATE_AWAITING_DISPUTE_MARKETS =
  "UPDATE_AWAITING_DISPUTE_MARKETS";
export const UPDATE_RESOLVED_REPORTING_MARKETS =
  "UPDATE_RESOLVED_REPORTING_MARKETS";
export const UPDATE_OPEN_REPORTING_MARKETS = "UPDATE_OPEN_REPORTING_MARKETS";
export const UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS =
  "UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS";

/**
 *
 * @param {string[]} marketIds
 * @returns {{type: string, data: string[]}}
 */
export function updateDesignatedReportingMarkets(marketIds) {
  return {
    type: UPDATE_DESIGNATED_REPORTING_MARKETS,
    data: marketIds
  };
}

/**
 *
 * @param {string[]} marketIds
 * @returns {{type: string, data: string[]}}
 */
export function updateAwaitingDisputeMarkets(marketIds) {
  return {
    type: UPDATE_AWAITING_DISPUTE_MARKETS,
    data: marketIds
  };
}

/**
 *
 * @param {string[]} marketIds
 * @returns {{type: string, data: string[]}}
 */
export function updateCrowdDisputeMarkets(marketIds) {
  return {
    type: UPDATE_CROWD_DISPUTE_MARKETS,
    data: marketIds
  };
}

/**
 *
 * @param {string[]} marketIds
 * @returns {{type: string, data: string[]}}
 */
export function updateResolvedMarkets(marketIds) {
  return {
    type: UPDATE_RESOLVED_REPORTING_MARKETS,
    data: marketIds
  };
}

/**
 *
 * @param {string[]} marketIds
 * @returns {{type: string, data: string[]}}
 */
export function updateOpenMarkets(marketIds) {
  return {
    type: UPDATE_OPEN_REPORTING_MARKETS,
    data: marketIds
  };
}

/**
 *
 * @param {string[]} marketIds
 * @returns {{type: string, data: string[]}}
 */
export function updateUpcomingDesignatedReportingMarkets(marketIds) {
  return {
    type: UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS,
    data: marketIds
  };
}

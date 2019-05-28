import { constants } from "services/augurjs";
import {
  ALL_MARKETS,
  MARKET_OPEN,
  MARKET_REPORTING,
  MARKET_CLOSED
} from "modules/common-elements/constants";
import { orderBy } from "lodash";

export const createMarketsStateObject = markets => {
  const openPositionMarkets = [];
  const reportingMarkets = [];
  const closedMarkets = [];

  const reportingStates = constants.REPORTING_STATE;

  markets.forEach(market => {
    if (
      market.reportingState === reportingStates.FINALIZED ||
      market.reportingState === reportingStates.AWAITING_FINALIZATION
    ) {
      closedMarkets.push(market);
    } else if (market.reportingState !== reportingStates.PRE_REPORTING) {
      reportingMarkets.push(market);
    } else {
      openPositionMarkets.push(market);
    }
  });

  const orderdClosedMarkets = orderBy(
    closedMarkets,
    ["endTime.timestamp"],
    ["desc"]
  );

  const marketsObject = {
    [ALL_MARKETS]: markets,
    [MARKET_OPEN]: openPositionMarkets,
    [MARKET_REPORTING]: reportingMarkets,
    [MARKET_CLOSED]: orderdClosedMarkets
  };

  return marketsObject;
};

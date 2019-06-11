import { constants } from "services/augurjs";
import {
  ALL_MARKETS,
  MARKET_OPEN,
  MARKET_REPORTING,
  MARKET_CLOSED,
} from "modules/common/constants";
import { orderBy } from "lodash";
import { MarketData } from "modules/types";

export const createMarketsStateObject = (markets) => {
  const openPositionMarkets: Array<MarketData> = [];
  const reportingMarkets: Array<MarketData> = [];
  const closedMarkets: Array<MarketData> = [];

  const reportingStates = constants.REPORTING_STATE;

  markets.forEach((market) => {
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
    ["desc"],
  );

  const marketsObject = {
    [ALL_MARKETS]: markets,
    [MARKET_OPEN]: openPositionMarkets,
    [MARKET_REPORTING]: reportingMarkets,
    [MARKET_CLOSED]: orderdClosedMarkets,
  };

  return marketsObject;
};

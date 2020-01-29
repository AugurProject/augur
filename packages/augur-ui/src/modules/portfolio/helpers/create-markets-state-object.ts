import {
  ALL_MARKETS,
  MARKET_OPEN,
  MARKET_REPORTING,
  MARKET_CLOSED,
  REPORTING_STATE,
} from "modules/common/constants";
import { orderBy } from "lodash";
import { MarketData } from "modules/types";

export const createMarketsStateObject = (markets) => {
  const openPositionMarkets: Array<MarketData> = [];
  const reportingMarkets: Array<MarketData> = [];
  const closedMarkets: Array<MarketData> = [];

  markets.forEach((market) => {
    if (
      market.reportingState &&
      (market.reportingState === REPORTING_STATE.FINALIZED ||
        market.reportingState === REPORTING_STATE.AWAITING_FINALIZATION)
    ) {
      closedMarkets.push(market);
    } else if (
      market.reportingState &&
      market.reportingState !== REPORTING_STATE.PRE_REPORTING
    ) {
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

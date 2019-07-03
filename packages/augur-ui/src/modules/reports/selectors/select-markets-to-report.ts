import store from "store";
import { REPORTING_STATE } from "modules/common/constants";
import { MarketData } from "modules/types";

function filterForkedMarket(market) {
  const { universe } = store.getState();
  return !(
    universe.isForkingMarketFinalized &&
    universe.isForking &&
    universe.forkingMarket === market.id
  );
}

export const selectMarketsToReport = (marketsData: Array<MarketData>, loginAddress) => {
  const markets = {};
  markets.designated = marketsData
    .filter(
      market =>
        market.reportingState ===
          REPORTING_STATE.DESIGNATED_REPORTING &&
        market.designatedReporter === loginAddress
    )
    .sort((a, b) => a.endTime - b.endTime);
  markets.open = marketsData
    .filter(
      market =>
        market.reportingState === REPORTING_STATE.OPEN_REPORTING
    )
    .sort((a, b) => a.endTime - b.endTime);
  markets.upcoming = marketsData
    .filter(
      market =>
        market.reportingState === REPORTING_STATE.PRE_REPORTING &&
        market.designatedReporter === loginAddress &&
        filterForkedMarket(market)
    )
    .sort((a, b) => a.endTime - b.endTime);

  return markets;
};

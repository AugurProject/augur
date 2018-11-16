import { createSelector } from "reselect";
import store from "src/store";
import { selectMarketReportState } from "src/select-state";
import { selectMarket } from "modules/markets/selectors/market";

function filterForkedMarket(market) {
  const { universe } = store.getState();
  return !(
    universe.isForkingMarketFinalized &&
    universe.isForking &&
    universe.forkingMarket === market.id
  );
}

const selectMarketsToReportSelector = () =>
  createSelector(selectMarketReportState, reportData => ({
    designated: reportData.designated
      .map(selectMarket)
      .sort((a, b) => a.endTime.timestamp - b.endTime.timestamp),
    open: reportData.open
      .map(selectMarket)
      .sort((a, b) => a.endTime.timestamp - b.endTime.timestamp),
    upcoming: reportData.upcoming
      .map(selectMarket)
      .sort((a, b) => a.endTime.timestamp - b.endTime.timestamp),
    resolved: reportData.resolved
      .map(selectMarket)
      .filter(filterForkedMarket)
      .sort((a, b) => a.endTime.timestamp - b.endTime.timestamp)
  }));

export const selectMarketsToReport = selectMarketsToReportSelector();

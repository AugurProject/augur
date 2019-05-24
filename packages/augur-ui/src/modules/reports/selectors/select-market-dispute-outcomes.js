import { createSelector } from "reselect";
import { selectMarkets } from "modules/markets/selectors/markets-all";
import { constants } from "services/augurjs";
import store from "store";
import { isEmpty } from "lodash";

import selectDisputeOutcomes from "modules/reports/selectors/select-dispute-outcomes";
import { selectUniverseState } from "store/select-state";
import fillDisputeOutcomeProgress from "modules/reports/selectors/fill-dispute-outcome-progress";

export default function() {
  return selectMarketDisputeOutcomes(store.getState());
}

export const selectMarketDisputeOutcomes = createSelector(
  selectMarkets,
  selectUniverseState,
  (markets, universe) => {
    if (isEmpty(markets) || !universe.forkThreshold) {
      return {};
    }
    const disputeMarkets = markets.filter(
      market =>
        market.reportingState ===
          constants.REPORTING_STATE.AWAITING_FORK_MIGRATION ||
        market.reportingState ===
          constants.REPORTING_STATE.CROWDSOURCING_DISPUTE ||
        market.reportingState === constants.REPORTING_STATE.AWAITING_NEXT_WINDOW
    );
    const disputeOutcomes = {};
    const outcomes = disputeMarkets.reduce((p, m) => {
      if (m.disputeInfo) {
        p[m.id] = selectDisputeOutcomes(
          m,
          m.disputeInfo.stakes,
          m.disputeInfo.bondSizeOfNewStake,
          universe.forkThreshold
        ).map(o =>
          fillDisputeOutcomeProgress(m.disputeInfo.bondSizeOfNewStake, o)
        );
      }
      return p;
    }, disputeOutcomes);

    return outcomes;
  }
);

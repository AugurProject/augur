import { createSelector } from 'reselect';
import {
  selectMarketInfosState,
  selectReportingListState,
} from 'store/select-state';
import { selectMarket } from 'modules/markets/selectors/market';
import { REPORTING_STATE } from 'modules/common/constants';

export const disputingMarkets = state => selectDisputingMarkets(state);

// marketInfos is used to trigger selector when ever market info object change
// needed to keep UI refreshed via log-handlers
const selectDisputingMarkets = createSelector(
  selectMarketInfosState,
  selectReportingListState,
  (marketInfos, reportingList) => {
    return {
      [REPORTING_STATE.CROWDSOURCING_DISPUTE]:
        (reportingList[REPORTING_STATE.CROWDSOURCING_DISPUTE] || []).map(id =>
          selectMarket(id)
        ) || [],
      [REPORTING_STATE.AWAITING_NEXT_WINDOW]:
        (reportingList[REPORTING_STATE.AWAITING_NEXT_WINDOW] || []).map(id =>
          selectMarket(id)
        ) || [],
    };
  }
);

const selectReportingStateMarketIds = (state, reportingState) =>
  selectReportingListState(state)[reportingState];

// marketInfos is used to trigger selector when ever market info object change
// needed to keep UI refreshed via log-handlers
export const selectReportingMarkets = createSelector(
  selectMarketInfosState,
  selectReportingStateMarketIds,
  (marketInfos, specificReportingList) =>
    (specificReportingList || []).map(id => selectMarket(id) || [])
);

import { createSelector } from 'reselect';
import {
  selectReportingListState,
} from 'appStore/select-state';
import { selectMarket } from 'modules/markets/selectors/market';
import { REPORTING_STATE } from 'modules/common/constants';
import { Markets } from '../store/markets';

export const disputingMarkets = state => selectDisputingMarkets(state);

// marketInfos is used to trigger selector when ever market info object change
// needed to keep UI refreshed via log-handlers
const selectDisputingMarkets = createSelector(
  selectReportingListState,
  (reportingListState) => {
    const { marketInfos } = Markets.get();
    return {
      [REPORTING_STATE.CROWDSOURCING_DISPUTE]:
        (
          (reportingListState[REPORTING_STATE.CROWDSOURCING_DISPUTE] || {})
            .marketIds || []
        ).map(id => selectMarket(id)) || [],
      [REPORTING_STATE.AWAITING_NEXT_WINDOW]:
        (
          (reportingListState[REPORTING_STATE.AWAITING_NEXT_WINDOW] || {})
            .marketIds || []
        ).map(id => selectMarket(id)) || [],
    };
  }
);

const selectReportingStateMarketIds = (state, reportingState) =>
  selectReportingListState(state)[reportingState];

// marketInfos is used to trigger selector when ever market info object change
// needed to keep UI refreshed via log-handlers
export const selectReportingMarkets = createSelector(
  selectReportingStateMarketIds,
  (specificReportingList) =>
    ((specificReportingList || {}).marketIds || []).map(
      id => selectMarket(id) || []
    )
);

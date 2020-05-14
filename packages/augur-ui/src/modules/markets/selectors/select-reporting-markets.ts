import { createSelector } from 'reselect';
import {
  selectReportingListState,
} from 'appStore/select-state';
import { selectMarket } from 'modules/markets/selectors/market';
import { REPORTING_STATE } from 'modules/common/constants';
import { Markets } from '../store/markets';
import { AppStatus } from 'modules/app/store/app-status';
import { convertMarketInfoToMarketData } from 'utils/convert-marketInfo-marketData';

export const disputingMarkets = state => selectDisputingMarkets(state);

// marketInfos is used to trigger selector when ever market info object change
// needed to keep UI refreshed via log-handlers
const selectDisputingMarkets = state => {
  const { reportingListState } = Markets.get();

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
};

export const selectReportingMarkets = (reportingState) => {
  const { reportingListState } = Markets.get();
  return ((reportingListState[reportingState] || {}).marketIds || []).map(
    id => selectMarket(id) || []
  )
}

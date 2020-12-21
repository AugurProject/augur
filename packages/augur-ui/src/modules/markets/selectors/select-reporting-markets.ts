import { selectMarket } from 'modules/markets/selectors/market';
import { REPORTING_STATE } from 'modules/common/constants';
import { loadMarketsInfoIfNotLoaded } from '../actions/load-markets-info';

// marketInfos is used to trigger selector when ever market info object change
// needed to keep UI refreshed via log-handlers
export const selectDisputingMarkets = (reportingListState) => {

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

export const selectReportingMarkets = (reportingListState) => {
  const marketsDR = (
    (reportingListState[REPORTING_STATE.DESIGNATED_REPORTING] || {}).marketIds || []
  );

  const marketsPR = (
    (reportingListState[REPORTING_STATE.PRE_REPORTING] || {}).marketIds || []
  );

  const marketsOR = (
    (reportingListState[REPORTING_STATE.OPEN_REPORTING] || {}).marketIds || []
  )

  loadMarketsInfoIfNotLoaded(marketsDR.concat(marketsPR).concat(marketsOR));

  return {
    [REPORTING_STATE.DESIGNATED_REPORTING]: marketsDR.map(id => selectMarket(id)) || [],
    [REPORTING_STATE.PRE_REPORTING]: marketsPR.map(id => selectMarket(id)) || [],
    [REPORTING_STATE.OPEN_REPORTING]: marketsOR.map(id => selectMarket(id)) || [],
  };
};

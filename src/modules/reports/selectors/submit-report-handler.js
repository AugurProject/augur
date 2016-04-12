import memoizerific from 'memoizerific';

import { SUBMIT_REPORT } from '../../transactions/constants/types';
import { INDETERMINATE_OUTCOME_ID, INDETERMINATE_OUTCOME_NAME } from '../../markets/constants/market-outcomes';

import * as ReportsActions from '../../reports/actions/reports-actions';
import * as TransactionsActions from '../../transactions/actions/transactions-actions';
import * as LinkActions from '../../link/actions/link-actions';

import store from '../../../store';

import { selectNewTransaction } from '../../transactions/selectors/transactions';
import { selectMarketLink, selectMarketsLink } from '../../link/selectors/links';
import { selectMarket } from '../../market/selectors/market';
import { selectOutcome } from '../../market/selectors/outcomes';

export default function() {
    var { selectedMarketID, pendingReports, recentlyExpiredEvents, recentlyExpiredMarkets, outcomes } = store.getState();
	return selectSubmitReportHandler(selectedMarketID, pendingReports, recentlyExpiredEvents, recentlyExpiredMarkets, outcomes, store.dispatch);
}

export const selectSubmitReportHandler = memoizerific(1)(function(selectedMarketID, pendingReports, recentlyExpiredEvents, recentlyExpiredMarkets, outcomes, dispatch) {
	var nextPendingReportEventID = Object.keys(pendingReports).find(eventID => (
			!pendingReports[eventID].reportHash &&
			recentlyExpiredEvents[eventID] &&
			recentlyExpiredEvents[eventID].marketID &&
			recentlyExpiredEvents[eventID].marketID !== selectedMarketID
		)),
		recentlyExpiredEvent = recentlyExpiredEvents[nextPendingReportEventID],
		nextPendingReportMarket = recentlyExpiredEvent && selectMarket(recentlyExpiredEvent.marketID),
		currentEventID = recentlyExpiredMarkets[selectedMarketID];

	return function(reportedOutcomeID, isUnethical) {
		var outcome;
		if (reportedOutcomeID === INDETERMINATE_OUTCOME_ID) {
			outcome = { id: INDETERMINATE_OUTCOME_ID, name: INDETERMINATE_OUTCOME_NAME };
		}
		else {
			outcome = selectOutcome(selectedMarketID, reportedOutcomeID, outcomes[selectedMarketID][reportedOutcomeID]);
		}

		if (!outcome) {
			console.log('WEIRD!!', reportedOutcomeID, isUnethical, selectedMarketID);
			return;
		}

		dispatch(ReportsActions.updatePendingReports({ [currentEventID]: { reportHash: true } }));

		dispatch(TransactionsActions.addTransactions([selectNewTransaction(
			SUBMIT_REPORT,
			0,
			0,
			0,
			0,
			{
				market: selectMarket(selectedMarketID),
				outcome: outcome,
				isUnethical
			},
			(transactionID) => 	dispatch(ReportsActions.submitReport(transactionID, selectedMarketID, reportedOutcomeID, isUnethical))
		)]));

		if (nextPendingReportMarket) {
			selectMarketLink(nextPendingReportMarket, dispatch).onClick();
		}
		else {
			selectMarketsLink(dispatch).onClick();
		}
	};
});
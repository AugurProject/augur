import * as AugurJS from '../../../services/augurjs';

import secureRandom from 'secure-random';
import { bytesToHex } from '../../../utils/bytes-to-hex';

import { BRANCH_ID } from '../../app/constants/network';
import { INDETERMINATE_OUTCOME_ID, INDETERMINATE_OUTCOME_NAME } from '../../markets/constants/market-outcomes';
import { BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../markets/constants/market-types';
import { PENDING, SUCCESS, FAILED, CREATING_MARKET } from '../../transactions/constants/statuses';
import { SUBMIT_REPORT } from '../../transactions/constants/types';

import * as MarketActions from '../../markets/actions/markets-actions';
import * as TransactionsActions from '../../transactions/actions/transactions-actions';

import { selectNewTransaction } from '../../transactions/selectors/transactions';
import { selectMarket } from '../../market/selectors/market';
import { selectMarketLink, selectMarketsLink } from '../../link/selectors/links';

export const UPDATE_RECENTLY_EXPIRED_EVENTS = 'UPDATE_RECENTLY_EXPIRED_EVENTS';
export const UPDATE_PENDING_REPORTS = 'UPDATE_PENDING_REPORTS';

export function loadRecentlyExpiredEvents() {
	return (dispatch, getState) => {
		var { blockchain } = getState(),
			gatheredRecentlyExpiredEvents = {},
			timeoutID;

		AugurJS.loadRecentlyExpiredEventIDs(BRANCH_ID, blockchain.reportPeriod, (err, recentlyExpiredEvents) => {
			if (err) {
				console.log('ERROR loadRecentlyExpiredEventIDs', err);
				return;
			}

			gatheredRecentlyExpiredEvents = {
				...gatheredRecentlyExpiredEvents,
				...(recentlyExpiredEvents || {})
			};

			if (timeoutID) {
				clearTimeout(timeoutID);
			}
			timeoutID = setTimeout(() => {
					dispatch({ type: UPDATE_RECENTLY_EXPIRED_EVENTS, recentlyExpiredEvents: gatheredRecentlyExpiredEvents });
					dispatch(loadPendingReports(Object.keys(gatheredRecentlyExpiredEvents)));
					gatheredRecentlyExpiredEvents = {};
				}, 450);
		});
	};
}

export function loadPendingReports(eventIDs) {
	return (dispatch, getState) => {
		var { loginAccount, blockchain } = getState();
		if (!loginAccount || !loginAccount.id) {
			return;
		}
		AugurJS.loadPendingReportEventIDs(eventIDs, loginAccount.id, blockchain.reportPeriod, BRANCH_ID, (err, eventIDs) => {
			if (err) {
				console.log('ERROR loadPendingReports', err);
				return;
			}
			dispatch({ type: UPDATE_PENDING_REPORTS, pendingReports: eventIDs });
		});
	};
}

export function submitReport(market, reportedOutcomeID, isUnethical) {
	return (dispatch, getState) => {
		var { pendingReports, recentlyExpiredEvents, recentlyExpiredMarkets } = getState(),
			currentEventID = recentlyExpiredMarkets[market.id];

		dispatch(updatePendingReports({ [currentEventID]: { reportHash: true } }));

		dispatch(TransactionsActions.addTransactions([selectNewTransaction(
			SUBMIT_REPORT,
			0,
			0,
			0,
			0,
			{
				market: market,
				outcome: market.reportableOutcomes.find(outcome => outcome.id === reportedOutcomeID) || {},
				reportedOutcomeID,
				isUnethical
			},
			(transactionID) => 	dispatch(processReport(transactionID, market, reportedOutcomeID, isUnethical))
		)]));

		var nextPendingReportEventID = Object.keys(pendingReports).find(eventID => (
					!pendingReports[eventID].reportHash &&
					recentlyExpiredEvents[eventID] &&
					recentlyExpiredEvents[eventID].marketID &&
					recentlyExpiredEvents[eventID].marketID !== market.id
				)),
				recentlyExpiredEvent = recentlyExpiredEvents[nextPendingReportEventID],
				nextPendingReportMarket = recentlyExpiredEvent && selectMarket(recentlyExpiredEvent.marketID);

		if (nextPendingReportMarket) {
			selectMarketLink(nextPendingReportMarket, dispatch).onClick();
		}
		else {
			selectMarketsLink(dispatch).onClick();
		}
	};
}

export function processReport(transactionID, market, reportedOutcomeID, isUnethical) {
	return (dispatch, getState) => {
		var { loginAccount, recentlyExpiredEvents, recentlyExpiredMarkets, blockchain } = getState(),
			eventID = recentlyExpiredMarkets[market.id],
			event = recentlyExpiredEvents[eventID],
			report;

		if (!loginAccount || !loginAccount.id || !eventID || !event || !market || !reportedOutcomeID ) {
			return dispatch(TransactionsActions.updateTransactions({
				[transactionID]: { status: FAILED, message: 'Missing data' }
			}));
		}

		dispatch(TransactionsActions.updateTransactions({
			[transactionID]: { status: 'sending...' }
		}));

		report = {
			reportPeriod: blockchain.reportPeriod.toString(),
			reportedOutcomeID,
			isIndeterminate: reportedOutcomeID === INDETERMINATE_OUTCOME_ID,
			isCategorical: market.type === CATEGORICAL,
			isScalar: market.type === SCALAR,
			isUnethical,
			salt: bytesToHex(secureRandom(32)),
			reportHash: true
		};

		dispatch(updatePendingReports({ [eventID]: report }));

		AugurJS.submitReportHash(BRANCH_ID, loginAccount.id, { ...event, id: eventID }, report, (err, res) => {
			if (err) {
				console.log('ERROR submitReportHash', err);
				return dispatch(TransactionsActions.updateTransactions({
					[transactionID]: { status: FAILED, message: err.message }
				}));
			}

			dispatch(TransactionsActions.updateTransactions({
				[transactionID]: { status: res.status }
			}));

			if (res.status === SUCCESS) {
				dispatch(updatePendingReports({ [eventID]: { reportHash: res.reportHash }}));
			}

			return;
		});
	};
}

export function updatePendingReports(pendingReports) {
	return { type: UPDATE_PENDING_REPORTS, pendingReports };
}
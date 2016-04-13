import * as AugurJS from '../../../services/augurjs';

import secureRandom from 'secure-random';
import { bytesToHex } from '../../../utils/bytes-to-hex';

import { BRANCH_ID } from '../../app/constants/network';
import { INDETERMINATE_OUTCOME_ID, INDETERMINATE_OUTCOME_NAME } from '../../markets/constants/market-outcomes';
import { BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../markets/constants/market-types';
import { PENDING, SUCCESS, FAILED, CREATING_MARKET } from '../../transactions/constants/statuses';

import * as MarketActions from '../../markets/actions/markets-actions';
import * as TransactionsActions from '../../transactions/actions/transactions-actions';

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

export function submitReport(transactionID, marketID, reportedOutcomeID, isUnethical) {
	return (dispatch, getState) => {
		var { loginAccount, markets, recentlyExpiredEvents, recentlyExpiredMarkets, blockchain } = getState(),
			eventID = recentlyExpiredMarkets[marketID],
			event = recentlyExpiredEvents[eventID],
			market = markets[marketID],
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
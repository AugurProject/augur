import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';

import { isMarketDataOpen } from '../../../utils/is-market-data-open';

export const UPDATE_PENDING_REPORTS = 'UPDATE_PENDING_REPORTS';
export const CLEAR_PENDING_REPORTS = 'CLEAR_PENDING_REPORTS';

export function loadPendingReports(marketsData) {
	return (dispatch, getState) => {
		var { loginAccount, blockchain } = getState(),
			eventIDs;

		if (!loginAccount || !loginAccount.id) {
			return;
		}

		eventIDs = Object.keys(marketsData)
			.filter(marketID => !isMarketDataOpen(marketsData[marketID], blockchain.currentBlockNumber))
			.map(marketID => marketsData[marketID].eventID);

		if (!eventIDs || !eventIDs.length) {
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

export function updatePendingReports(pendingReports) {
	return { type: UPDATE_PENDING_REPORTS, pendingReports };
}

export function clearPendingReports() {
	return { type: CLEAR_PENDING_REPORTS };
}
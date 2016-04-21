import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';

import { isMarketDataOpen } from '../../../utils/is-market-data-open';

export const UPDATE_REPORTS = 'UPDATE_REPORTS';
export const CLEAR_REPORTS = 'CLEAR_REPORTS';

export function loadReports(marketsData) {
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
				console.log('ERROR loadReports', err);
				return;
			}
			dispatch({ type: UPDATE_REPORTS, reports: eventIDs });
		});
	};
}

export function updateReports(reports) {
	return { type: UPDATE_REPORTS, reports };
}

export function clearReports() {
	return { type: CLEAR_REPORTS };
}
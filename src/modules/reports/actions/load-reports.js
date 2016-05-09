import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';

import { isMarketDataOpen } from '../../../utils/is-market-data-open';

import { updateReports } from '../../reports/actions/update-reports';

export function loadReports(marketsData) {
	return (dispatch, getState) => {
		var { loginAccount, blockchain } = getState(),
			eventIDs;

		if (!loginAccount || !loginAccount.id) {
			return;
		}

		eventIDs = Object.keys(marketsData)
			.filter(marketID => marketsData[marketID].eventID && !isMarketDataOpen(marketsData[marketID], blockchain.currentBlockNumber))
			.map(marketID => marketsData[marketID].eventID);

		if (!eventIDs || !eventIDs.length) {
			return;
		}

		AugurJS.loadPendingReportEventIDs(eventIDs, loginAccount.id, blockchain.reportPeriod, BRANCH_ID, (err, eventIDs) => {
			if (err) {
				console.log('ERROR loadReports', err);
				return;
			}
			dispatch(updateReports(eventIDs));
		});
	};
}
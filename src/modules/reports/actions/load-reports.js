import * as AugurJS from '../../../services/augurjs';
import { BRANCH_ID } from '../../app/constants/network';
import { isMarketDataOpen } from '../../../utils/is-market-data-open';
import { updateReports } from '../../reports/actions/update-reports';

export function loadReports(marketsData) {
	return (dispatch, getState) => {
		const { loginAccount, blockchain } = getState();

		if (!loginAccount || !loginAccount.id) {
			return;
		}

		const eventIDs = Object.keys(marketsData)
			.filter(marketID => marketsData[marketID].eventID &&
			!isMarketDataOpen(marketsData[marketID], blockchain.currentBlockNumber))
			.map(marketID => marketsData[marketID].eventID);

		if (!eventIDs || !eventIDs.length) {
			return;
		}

		AugurJS.loadPendingReportEventIDs(
			eventIDs,
			loginAccount.id,
			blockchain.reportPeriod,
			BRANCH_ID, (err, evtIDs) => {
				if (err) {
					console.log('ERROR loadReports', err);
					return;
				}
				dispatch(updateReports(evtIDs));
			});
	};
}

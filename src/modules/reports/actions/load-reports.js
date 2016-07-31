import * as AugurJS from '../../../services/augurjs';
import { BRANCH_ID } from '../../app/constants/network';
// import { isMarketDataOpen } from '../../../utils/is-market-data-open';
import { updateReports } from '../../reports/actions/update-reports';

export function loadReports(marketsData) {
	return (dispatch, getState) => {
		const { loginAccount, blockchain, branch } = getState();

		if (!loginAccount || !loginAccount.id) {
			return;
		}

		AugurJS.getEventsToReportOn(
			branch.id,
			blockchain.reportPeriod,
			loginAccount.id,
			0,
			BRANCH_ID, (err, evtIDs) => {
				if (err) {
					console.log('ERROR loadReports', err);
					return;
				}
				dispatch(updateReports(evtIDs));
			});
	};
}

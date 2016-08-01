import * as AugurJS from '../../../services/augurjs';
import { updateReports } from '../../reports/actions/update-reports';

export function loadReports(marketsData) {
	return (dispatch, getState) => {
		const { loginAccount, blockchain, branch } = getState();

		if (!loginAccount || !loginAccount.id || !branch.id || !blockchain.reportPeriod) {
			return;
		}

		AugurJS.getEventsToReportOn(
			branch.id,
			blockchain.reportPeriod,
			loginAccount.id,
			0,
			(err, evtIDs) => {
				if (err) {
					console.log('ERROR loadReports', err);
					return;
				}
				dispatch(updateReports(evtIDs));
			}
		);
	};
}

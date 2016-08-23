import { augur } from '../../../services/augurjs';
import { updateEventsWithAccountReportData } from '../../my-reports/actions/update-events-with-account-report-data';

export function loadEventsWithSubmittedReport(loadMore) {
	return (dispatch, getState) => {
		const { branch, blockchain, loginAccount, accountReports } = getState();

		if (branch.id && blockchain.currentPeriod && loginAccount.id) {
			const oldestLoadedPeriod = accountReports && accountReports.oldestLoadedPeriod || blockchain.currentPeriod - 5;

			let startPeriod = !!loadMore ? oldestLoadedPeriod - 5 : blockchain.currentPeriod - 5;

			dispatch(updateEventsWithAccountReportData({ oldestLoadedPeriod: startPeriod }));

			while (startPeriod <= blockchain.currentPeriod) {
				augur.getEventsWithSubmittedReport(branch.id, startPeriod, loginAccount.id, (eventIDs) => {
					console.log('getEventsWithSubmittedReport res -- ', eventIDs);

					const events = {};
					(eventIDs || []).forEach(eventID => {
						if (parseInt(eventID.substring(2), 10) !== 0) events[eventID] = { branch: branch.id, period: startPeriod };
					});

					dispatch(updateEventsWithAccountReportData({ events }));
				});

				startPeriod++;
			}
		}
	};
}

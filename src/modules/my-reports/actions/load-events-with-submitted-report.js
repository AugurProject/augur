import { augur } from '../../../services/augurjs';
import { updateOldestLoadedEventPeriod } from '../../my-reports/actions/update-oldest-loaded-event-period';
import { updateEventsWithAccountReportData } from '../../my-reports/actions/update-events-with-account-report-data';

export function loadEventsWithSubmittedReport(loadMore) {
	return (dispatch, getState) => {
		const { branch, blockchain, loginAccount, oldestLoadedEventPeriod } = getState();

		if (branch.id && blockchain.currentPeriod && loginAccount.id) {
			const oldestLoadedPeriod = oldestLoadedEventPeriod || blockchain.currentPeriod - 5;

			let startPeriod = !!loadMore ? oldestLoadedPeriod - 5 : blockchain.currentPeriod - 5;

			dispatch(updateOldestLoadedEventPeriod(oldestLoadedPeriod));

			while (startPeriod <= blockchain.currentPeriod) {
				getEventsWithReports(branch.id, startPeriod, loginAccount.id, dispatch);
				startPeriod++;
			}
		}
	};
}

export function getEventsWithReports(branch, period, accountID, dispatch) {
	augur.getEventsWithSubmittedReport(branch, period, accountID, (eventIDs) => {
		const events = {};
		(eventIDs || []).forEach(eventID => {
			if (parseInt(eventID, 16)) events[eventID] = { branch, period };
		});

		dispatch(updateEventsWithAccountReportData({ events }));
	});
}

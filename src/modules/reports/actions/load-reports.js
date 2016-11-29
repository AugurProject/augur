import async from 'async';
import { augur } from '../../../services/augurjs';
import { loadReport } from '../../reports/actions/load-report';
import { loadReportDescriptors } from '../../reports/actions/load-report-descriptors';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';

export function loadReports(callback) {
	return (dispatch, getState) => {
		const { loginAccount, branch, reports } = getState();
		if (!loginAccount || !loginAccount.address || !branch.id || !branch.reportPeriod) {
			return;
		}
		const period = branch.reportPeriod;
		const account = loginAccount.address;
		const branchID = branch.id;
		const marketIDs = [];
		augur.getEventsToReportOn(branchID, period, account, 0, (eventsToReportOn) => {
			if (augur.options.debug.reporting) {
				console.log('eventsToReportOn:', eventsToReportOn);
			}
			async.eachSeries(eventsToReportOn, (eventID, nextEvent) => {
				if (!eventID || !parseInt(eventID, 16)) return nextEvent();
				augur.getMarket(eventID, 0, (marketID) => {
					marketIDs.push(marketID);
					dispatch(loadMarketsInfo([marketID], () => {
						if (reports[branchID] && reports[branchID][eventID] && reports[branchID][eventID].isRevealed) {
							return nextEvent();
						}
						dispatch(loadReport(branchID, period, eventID, marketID, nextEvent));
					}));
				});
			}, (err) => {
				if (err) {
					if (callback) callback(err);
				} else {
					if (!marketIDs.length) {
						if (callback) callback(null, marketIDs);
					} else {
						dispatch(loadReportDescriptors((e) => {
							if (callback) {
								if (e) return callback(e);
								callback(null, marketIDs);
							}
						}));
					}
				}
			});
		});
	};
}

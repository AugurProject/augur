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
		const branchReports = reports[branchID];
		console.log('branchReports:', branchReports);
		augur.getEventsToReportOn(branchID, period, account, 0, (eventsToReportOn) => {
			console.log('eventsToReportOn:', eventsToReportOn);
			async.eachSeries(eventsToReportOn, (eventID, nextEvent) => {
				if (!eventID || !parseInt(eventID, 16)) return nextEvent();
				augur.getMarket(eventID, 0, (marketID) => {
					marketIDs.push(marketID);
					// TODO check if already loaded
					dispatch(loadMarketsInfo([marketID], () => {
						if (branchReports && branchReports[eventID] && branchReports[eventID].reportedOutcomeID) {
							console.log('skipping load:', eventID, branchReports[eventID]);
							return nextEvent();
						}
						dispatch(loadReport(branchID, period, eventID, marketID, nextEvent));
					}));
				});
			}, (err) => {
				if (err) {
					if (callback) callback(err);
				} else if (!marketIDs.length) {
					if (callback) callback(null, marketIDs);
				} else {
					dispatch(loadReportDescriptors((e) => {
						if (callback) {
							if (e) return callback(e);
							callback(null, marketIDs);
						}
					}));
				}
			});
		});
	};
}

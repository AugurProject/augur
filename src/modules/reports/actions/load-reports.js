import async from 'async';
import { augur } from '../../../services/augurjs';
import { updateReports } from '../../reports/actions/update-reports';
import { updateMarketsData } from '../../markets/actions/update-markets-data';
import { loadFullMarket } from '../../market/actions/load-full-market';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';

function decryptReport(loginAccount, branchID, period, eventID, report, callback) {
	if (!loginAccount.derivedKey) return callback(null, report);
	augur.getAndDecryptReport(branchID, period, loginAccount.id, eventID, {
		derivedKey: loginAccount.derivedKey,
		salt: loginAccount.keystore.crypto.kdfparams.salt
	}, (plaintext) => {
		if (!plaintext) return callback('getAndDecryptReport failed');
		if (!plaintext.report || plaintext.error) {
			return callback(plaintext);
		}
		report.reportedOutcomeID = plaintext.report;
		report.salt = plaintext.salt;
		callback(null, report);
	});
}

export function loadReports(callback) {
	return (dispatch, getState) => {
		const { loginAccount, branch, reports } = getState();
		if (!loginAccount || !loginAccount.id || !branch.id || !branch.reportPeriod) {
			return;
		}
		const period = branch.reportPeriod;
		const account = loginAccount.id;
		const branchID = branch.id;
		console.log('calling getEventsToReportOn:', branchID, period, account);
		const marketIDs = [];
		augur.getEventsToReportOn(branchID, period, account, 0, (eventsToReportOn) => {
			console.log('eventsToReportOn:', eventsToReportOn);
			async.eachSeries(eventsToReportOn, (eventID, nextEvent) => {
				if (!reports[branchID]) reports[branchID] = {};
				if (!eventID || !parseInt(eventID, 16)) return nextEvent();
				const report = reports[branchID][eventID] || { eventID };
				augur.getMarket(eventID, 0, (marketID) => {
					marketIDs.push(marketID);
					dispatch(updateMarketsData({ [marketID]: { eventID } }));
					report.marketID = marketID;
					console.log('report for', eventID, report, marketID);
					if (report.reportedOutcomeID && report.salt) {
						console.debug('Event', eventID, 'is good-to-go!');
						// dispatch(loadMarketsInfo([marketID], ()));
						return nextEvent();
					}
					if (report.reportHash) {
						decryptReport(loginAccount, branchID, period, eventID, report, (err, decryptedReport) => {
							if (err) return nextEvent(err);
							reports[branchID][eventID] = decryptedReport;
							nextEvent();
						});
					} else {
						augur.getReportHash(branchID, period, account, eventID, (reportHash) => {
							console.log('augur.getReportHash:', reportHash);
							if (!reportHash || reportHash.error || !parseInt(reportHash, 16)) {
								report.reportHash = null;
								reports[branchID][eventID] = report;
								return nextEvent();
							}
							report.reportHash = reportHash;
							decryptReport(loginAccount, branchID, period, eventID, report, (err, decryptedReport) => {
								if (err) return nextEvent(err);
								reports[branchID][eventID] = decryptedReport;
								nextEvent();
							});
						});
					}
				});
			}, (err) => {
				if (err) return callback && callback(err);
				console.debug('updated reports:', reports);
				dispatch(updateReports(reports));
				if (!marketIDs.length) return callback && callback(null);
				dispatch(loadMarketsInfo(marketIDs, () => callback && callback(null)));
			});
		});
	};
}

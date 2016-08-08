import async from 'async';
import { augur } from '../../../services/augurjs';
import { updateReports } from '../../reports/actions/update-reports';

function decryptReport(loginAccount, branchID, period, eventID, report, callback) {
	if (!loginAccount.derivedKey) return callback(null, report);
	augur.getAndDecryptReport(branchID, period, loginAccount.id, eventID, {
		derivedKey: loginAccount.derivedKey,
		salt: loginAccount.keystore.crypto.kdfparams.salt
	}, (plaintext) => {
		if (!plaintext) return callback('getAndDecryptReport failed');
		if (!plaintext.reportedOutcomeID || plaintext.error) {
			return callback(plaintext);
		}
		report.reportedOutcomeID = plaintext.report;
		report.salt = plaintext.salt;
		callback(null, report);
	});
}

export function loadReports(callback) {
	return (dispatch, getState) => {
		const { loginAccount, blockchain, branch, reports } = getState();
		if (!loginAccount || !loginAccount.id || !branch.id || !blockchain.reportPeriod) {
			return;
		}
		const period = blockchain.reportPeriod;
		const account = loginAccount.id;
		const branchID = branch.id;
		augur.getEventsToReportOn(branchID, period, account, 0, (eventsToReportOn) => {
			async.eachSeries(eventsToReportOn, (eventID, nextEvent) => {
				if (!reports[branchID]) reports[branchID] = {};
				const report = reports[branchID][eventID] || {};
				console.log('report for', eventID, report);
				if (report.reportedOutcomeID && report.salt) {
					console.debug('Event', eventID, 'is good-to-go!');
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
			}, (err) => {
				if (err) return callback && callback(err);
				console.debug('updated reports:', reports);
				dispatch(updateReports(reports));
				return callback && callback(null);
			});
		});
	};
}

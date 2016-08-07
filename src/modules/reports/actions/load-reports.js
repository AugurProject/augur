import async from 'async';
import { augur } from '../../../services/augurjs';
import { updateReports } from '../../reports/actions/update-reports';

export function loadReports() {
	return (dispatch, getState) => {
		const { loginAccount, blockchain, branch, reports } = getState();
		if (!loginAccount || !loginAccount.id || !branch.id || !blockchain.reportPeriod) {
			return;
		}
		const period = blockchain.reportPeriod;
		const account = loginAccount.id;
		augur.getEventsToReportOn(branch.id, period, account, 0, (eventsToReportOn) => {
			async.eachSeries(eventsToReportOn, (eventID, nextEvent) => {
				if (!reports[branch.id]) reports[branch.id] = {};
				const report = reports[branch.id][eventID] || {};
				if (report.reportedOutcomeID && report.salt) {
					console.debug('Event', eventID, 'is good-to-go!');
					return nextEvent();
				}
				augur.getReportHash(branch.id, period, account, eventID, (reportHash) => {
					if (!reportHash || reportHash.error || !parseInt(reportHash, 16)) {
						report.reportHash = null;
						reports[branch.id][eventID] = report;
						return nextEvent();
					}
					report.reportHash = reportHash;
					if (!loginAccount.derivedKey) {
						reports[branch.id][eventID] = report;
						return nextEvent();
					}
					augur.getAndDecryptReport(branch.id, period, account, eventID, {
						derivedKey: loginAccount.derivedKey,
						salt: loginAccount.keystore.crypto.kdfparams.salt
					}, (plaintext) => {
						if (!plaintext) return nextEvent('getAndDecryptReport failed');
						if (!plaintext.reportedOutcomeID || plaintext.error) {
							return nextEvent(plaintext);
						}
						report.reportedOutcomeID = plaintext.report;
						report.salt = plaintext.salt;
						reports[branch.id][eventID] = report;
						nextEvent();
					});
				});
			}, (err) => {
				if (err) return console.error('loadReports:', err);
				console.debug('updated reports:', reports);
				dispatch(updateReports(reports));
			});
		});
	};
}

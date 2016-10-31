import async from 'async';
import { SCALAR } from '../../markets/constants/market-types';
import { INDETERMINATE_OUTCOME_ID, INDETERMINATE_SCALAR_OUTCOME_ID } from '../../markets/constants/market-outcomes';
import { augur } from '../../../services/augurjs';
import { updateReports } from '../../reports/actions/update-reports';
import { updateMarketsData } from '../../markets/actions/update-markets-data';
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
		report.isUnethical = parseInt(plaintext.ethics, 16) === 0;
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
				report.period = period;
				augur.getMarket(eventID, 0, (marketID) => {
					marketIDs.push(marketID);
					dispatch(updateMarketsData({ [marketID]: { eventID } }));
					report.marketID = marketID;
					console.log('report for', eventID, report, marketID);
					if (report.reportedOutcomeID && report.isRevealed) {
						console.debug('Event', eventID, 'is good-to-go!');
						return nextEvent();
					}
					console.log('getting report:', branch.id, period, eventID, loginAccount.id);
					augur.getReport(branch.id, period, eventID, loginAccount.id, (onChainReport) => {
						console.log('got report:', onChainReport);
						if (onChainReport && onChainReport !== '0') {
							report.reportedOutcomeID = onChainReport;
							report.isRevealed = true;
							reports[branchID][eventID] = report;
							return nextEvent();
						}
						report.isRevealed = false;
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
				});
			}, (err) => {
				if (err) return callback && callback(err);
				console.debug('updated reports:', reports);
				dispatch(updateReports(reports));
				if (!marketIDs.length) {
					if (callback) callback(null);
				} else {
					dispatch(loadMarketsInfo(marketIDs, () => {
						dispatch(loadReportDescriptors(() => {
							if (callback) callback(null);
						}));
					}));
				}
			});
		});
	};
}

export function loadReportDescriptors() {
	return (dispatch, getState) => {
		const { branch, loginAccount, marketsData, reports } = getState();
		const branchReports = { ...reports[branch.id] };
		async.forEachOfSeries(branchReports, (report, eventID, nextReport) => {
			report.isScalar = marketsData[report.marketID].type === SCALAR;
			if (report.reportedOutcomeID === undefined) {
				report.isIndeterminate = false;
				report.isUnethical = false;
				branchReports[eventID] = report;
				return nextReport();
			}
			report.isIndeterminate = report.isScalar ?
				report.reportedOutcomeID === INDETERMINATE_SCALAR_OUTCOME_ID :
				report.reportedOutcomeID === INDETERMINATE_OUTCOME_ID;
			augur.getEthicReport(branch.id, branch.reportPeriod, eventID, loginAccount.id, (ethics) => {
				// ethics values: 0=unethical, 1=ethical
				console.debug('ethics:', ethics);
				report.isUnethical = ethics === '0';
				branchReports[eventID] = report;
				nextReport();
			});
		}, (e) => {
			if (e) console.error('loadReportDescriptors:', e);
			dispatch(updateReports({ [branch.id]: branchReports }));
		});
	};
}

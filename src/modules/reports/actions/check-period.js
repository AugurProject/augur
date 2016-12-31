import { augur } from '../../../services/augurjs';
import { updateBranch } from '../../app/actions/update-branch';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { loadReports } from '../../reports/actions/load-reports';
import { clearOldReports } from '../../reports/actions/clear-old-reports';
import { revealReports } from '../../reports/actions/reveal-reports';
import { loadEventsWithSubmittedReport } from '../../my-reports/actions/load-events-with-submitted-report';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';

const tracker = {
	checkPeriodLock: false,
	reportsRevealed: false,
	notSoCurrentPeriod: 0
};

export function checkPeriod(unlock, cb) {
	return (dispatch, getState) => {
		const callback = cb || (e => e && console.log('checkPeriod:', e));
		const { loginAccount, branch } = getState();
		console.log('checkPeriod:', unlock, tracker);
		if (!branch.id || !loginAccount.address || loginAccount.rep === '0') {
			return callback(null);
		}
		const currentPeriod = augur.getCurrentPeriod(branch.periodLength);
		if (unlock || currentPeriod > tracker.notSoCurrentPeriod) {
			tracker.reportsRevealed = false;
			tracker.notSoCurrentPeriod = currentPeriod;
			tracker.checkPeriodLock = false;
			dispatch(clearOldReports());
		}
		if (tracker.checkPeriodLock) return callback(null);
		tracker.checkPeriodLock = true;
		augur.checkPeriod(branch.id, branch.periodLength, loginAccount.address, (err, reportPeriod) => {
			console.log('checkPeriod complete:', err, reportPeriod);
			if (err) {
				tracker.checkPeriodLock = false;
				return callback(err);
			}
			dispatch(updateBranch({ reportPeriod }));
			dispatch(loadEventsWithSubmittedReport());
			dispatch(clearOldReports());
			dispatch(loadReports((err) => {
				if (err) {
					tracker.checkPeriodLock = false;
					return callback(err);
				}
				if (branch.isReportRevealPhase) {
					if (!tracker.reportsRevealed) {
						tracker.reportsRevealed = true;
						dispatch(revealReports((err) => {
							console.log('revealReports complete:', err);
							if (err) {
								tracker.reportsRevealed = false;
								tracker.checkPeriodLock = false;
								console.error('revealReports:', err);
							}
						}));
					}
				} else {
					tracker.checkPeriodLock = false;
				}
				callback(null);
			}));
		}, (transactionID, eventOrMarketID, method) => {
			let message;
			switch (method) {
				case 'penalizeWrong': {
					if (eventOrMarketID) {
						const { branch, marketsData, reports } = getState();
						const myReport = reports[branch.id][eventOrMarketID];
						message = `comparing ${myReport.reportedOutcomeID} to ${marketsData[myReport.marketID].reportedOutcomeID}`;
					} else {
						message = '';
					}
					break;
				}
				case 'penalizationCatchup':
					message = 'catching up';
					break;
				case 'closeMarket':
					message = 'closing market';
					break;
				default:
					break;
			}
			console.log('updating transaction:', transactionID, message);
			dispatch(updateExistingTransaction(transactionID, { message }));
		}, (transactionID, eventOrMarketID, method) => {
			let message;
			switch (method) {
				case 'penalizeWrong': {
					if (eventOrMarketID) {
						const { branch, marketsData, reports } = getState();
						const myReport = reports[branch.id][eventOrMarketID];
						const myReportedOutcome = myReport.reportedOutcomeID;
						const consensusOutcome = marketsData[myReport.marketID].reportedOutcomeID;
						if (myReportedOutcome === consensusOutcome) {
							message = `reported outcome ${myReportedOutcome} matches the consensus`;
						} else {
							message = `reported outcome ${myReportedOutcome} does not match the consensus outcome ${consensusOutcome}`;
						}
					} else {
						message = '';
					}
					break;
				}
				case 'penalizationCatchup':
					message = 'caught up';
					break;
				case 'closeMarket':
					message = 'closed market';
					break;
				default:
					break;
			}
			console.log('updating transaction:', transactionID, message);
			dispatch(updateExistingTransaction(transactionID, { message }));
		});
	};
}

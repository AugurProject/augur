import secureRandom from 'secure-random';
import { formatRealEther } from '../../../utils/format-number';
import { augur } from '../../../services/augurjs';
import { bytesToHex } from '../../../utils/bytes-to-hex';
import { CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import { SUCCESS, FAILED, SUBMITTED } from '../../transactions/constants/statuses';
import { addCommitReportTransaction } from '../../transactions/actions/add-commit-report-transaction';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateReport, updateReports } from '../../reports/actions/update-reports';
import { nextReportPage } from '../../reports/actions/next-report-page';

export function commitReport(market, reportedOutcomeID, isUnethical, isIndeterminate) {
	return (dispatch, getState) => {
		const { branch, loginAccount } = getState();
		const salt = bytesToHex(secureRandom(32));
		const fixedReport = augur.fixReport(reportedOutcomeID, market.minValue, market.maxValue, market.type, isIndeterminate);
		dispatch(updateReport(branch.id, market.eventID, {
			eventID: market.eventID,
			marketID: market.id,
			period: branch.reportPeriod,
			reportedOutcomeID,
			isCategorical: market.type === CATEGORICAL,
			isScalar: market.type === SCALAR,
			isUnethical,
			isIndeterminate,
			salt,
			reportHash: augur.makeHash(salt, fixedReport, market.eventID, loginAccount.address),
			isCommitted: false,
			isRevealed: false
		}));
		dispatch(addCommitReportTransaction(market, reportedOutcomeID, isUnethical, isIndeterminate));
		dispatch(nextReportPage());
	};
}

export function sendCommitReport(transactionID, market, reportedOutcomeID, isUnethical, isIndeterminate) {
	return (dispatch, getState) => {
		const { loginAccount, branch, reports } = getState();
		const eventID = market.eventID;
		const report = reports[branch.id][eventID];
		console.log('reporting on market', market.id, 'event', eventID);
		console.log('report:', report);
		const branchID = branch.id;
		if (!loginAccount || !loginAccount.address || !eventID || !event || !market || !reportedOutcomeID) {
			return dispatch(updateExistingTransaction(transactionID, {
				status: FAILED,
				message: 'Missing data'
			}));
		}
		const fixedReport = augur.fixReport(reportedOutcomeID, market.minValue, market.maxValue, market.type, isIndeterminate);
		let encryptedReport = 0;
		let encryptedSalt = 0;
		if (loginAccount.derivedKey) {
			const derivedKey = loginAccount.derivedKey;
			encryptedReport = augur.encryptReport(fixedReport, derivedKey, report.salt);
			encryptedSalt = augur.encryptReport(report.salt, derivedKey, loginAccount.keystore.crypto.kdfparams.salt);
		}
		const outcomeName = report.isScalar ?
			reportedOutcomeID :
			(market.reportableOutcomes.find(outcome => outcome.id === reportedOutcomeID) || {}).name;
		augur.submitReportHash({
			event: eventID,
			reportHash: report.reportHash,
			encryptedReport,
			encryptedSalt,
			ethics: Number(!isUnethical),
			branch: branchID,
			period: report.reportPeriod,
			periodLength: branch.periodLength,
			onSent: (res) => {
				dispatch(updateExistingTransaction(transactionID, {
					status: SUBMITTED,
					message: `committing to report outcome ${outcomeName}`
				}));
			},
			onSuccess: (res) => {
				console.debug('submitReportHash successful:', res.callReturn);
				console.log('eventID:', eventID);
				console.log('marketID:', market.id);
				dispatch(updateExistingTransaction(transactionID, {
					status: SUCCESS,
					message: `committed to report outcome ${outcomeName}`,
					hash: res.hash,
					timestamp: res.timestamp,
					gasFees: formatRealEther(res.gasFees)
				}));
				const branchReports = getState().reports[branch.id] || {};
				dispatch(updateReports({
					[branchID]: {
						[eventID]: {
							...branchReports[eventID],
							isCommitted: true
						}
					}
				}));
			},
			onFailed: (err) => {
				console.error('submitReportHash failed', err);
				dispatch(updateExistingTransaction(transactionID, {
					status: FAILED,
					message: err.message
				}));
			}
		});
	};
}

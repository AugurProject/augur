import secureRandom from 'secure-random';
import { formatRealEther } from '../../../utils/format-number';
import { augur } from '../../../services/augurjs';
import { bytesToHex } from '../../../utils/bytes-to-hex';
import { CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import { SUCCESS, FAILED, SUBMITTED } from '../../transactions/constants/statuses';
import { addCommitReportTransaction } from '../../transactions/actions/add-commit-report-transaction';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { updateReport } from '../../reports/actions/update-reports';
import { nextReportPage } from '../../reports/actions/next-report-page';
import { deleteTransaction } from '../../transactions/actions/delete-transaction';

export function commitReport(market, reportedOutcomeID, isUnethical, isIndeterminate) {
	return (dispatch, getState) => {
		const { branch, loginAccount } = getState();
		const salt = bytesToHex(secureRandom(32));
		const fixedReport = augur.fixReport(reportedOutcomeID, market.minValue, market.maxValue, market.type, isIndeterminate);
		console.log('[commitReport] fixedReport:', fixedReport);
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
		console.log('fixedReport:', fixedReport);
		let encryptedReport = 0;
		let encryptedSalt = 0;
		if (loginAccount.derivedKey) {
			const derivedKey = loginAccount.derivedKey;
			encryptedReport = augur.encryptReport(fixedReport, derivedKey, report.salt);
			encryptedSalt = augur.encryptReport(report.salt, derivedKey);
		}
		console.log('encryptedReport:', encryptedReport, encryptedSalt);
		const outcomeName = report.isScalar ?
			reportedOutcomeID :
			(market.reportableOutcomes.find(outcome => outcome.id === reportedOutcomeID) || {}).name;
		dispatch(updateReport(branchID, eventID, { ...report }));
		augur.submitReportHash({
			event: eventID,
			reportHash: report.reportHash,
			encryptedReport,
			encryptedSalt,
			ethics: Number(!isUnethical),
			branch: branchID,
			period: report.period,
			periodLength: branch.periodLength,
			onSent: (res) => {
				dispatch(updateExistingTransaction(transactionID, {
					status: SUBMITTED,
					message: `committing to report outcome ${outcomeName}`
				}));
			},
			onSuccess: (res) => {
				console.log('eventID:', eventID);
				console.log('marketID:', market.id);
				dispatch(deleteTransaction(transactionID));
				const branchReports = getState().reports[branch.id] || {};
				console.log('updating branchReports:', branchReports);
				dispatch(updateReport(branch.id, eventID, {
					...branchReports[eventID],
					isCommitted: true
				}));
			},
			onFailed: (err) => {
				console.error('submitReportHash failed', err);
				dispatch(updateExistingTransaction(transactionID, {
					status: FAILED,
					message: err.message
				}));
				const branchReports = getState().reports[branch.id] || {};
				dispatch(updateReport(branch.id, eventID, {
					...branchReports[eventID],
					isCommitted: false
				}));
			}
		});
	};
}

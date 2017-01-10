import secureRandom from 'secure-random';
import { augur } from '../../../services/augurjs';
import { bytesToHex } from '../../../utils/bytes-to-hex';
import { CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import { updateReport } from '../../reports/actions/update-reports';
import { nextReportPage } from '../../reports/actions/next-report-page';
import { encryptReport } from '../../reports/actions/report-encryption';

export function commitReport(market, reportedOutcomeID, isUnethical, isIndeterminate) {
	return (dispatch, getState) => {
		const { branch, loginAccount } = getState();
		if (!loginAccount.address || !market || !reportedOutcomeID) {
			console.error('commitReport failed:', loginAccount.address, market, reportedOutcomeID);
			return dispatch(nextReportPage());
		}
		const eventID = market.eventID;
		const branchID = branch.id;
		console.log(`committing to report ${reportedOutcomeID} on market ${market.id} event ${eventID} period ${branch.reportPeriod}...`);
		const salt = bytesToHex(secureRandom(32));
		const fixedReport = augur.fixReport(reportedOutcomeID, market.minValue, market.maxValue, market.type, isIndeterminate);
		const report = {
			eventID,
			marketID: market.id,
			period: branch.reportPeriod,
			reportedOutcomeID,
			isCategorical: market.type === CATEGORICAL,
			isScalar: market.type === SCALAR,
			isUnethical,
			isIndeterminate,
			salt,
			reportHash: augur.makeHash(salt, fixedReport, eventID, loginAccount.address),
			isCommitted: false,
			isRevealed: false
		};
		const encrypted = encryptReport(fixedReport, loginAccount.derivedKey, salt);
		dispatch(updateReport(branchID, eventID, { ...report }));
		augur.submitReportHash({
			event: eventID,
			reportHash: report.reportHash,
			encryptedReport: encrypted.report,
			encryptedSalt: encrypted.salt,
			ethics: Number(!isUnethical),
			branch: branchID,
			period: branch.reportPeriod,
			periodLength: branch.periodLength,
			onSent: r => console.log('submitReportHash sent:', r),
			onSuccess: r => dispatch(updateReport(branchID, eventID, {
				...(getState().reports[branchID] || {})[eventID],
				isCommitted: true
			})),
			onFailed: (e) => {
				console.error('submitReportHash failed:', e);
				dispatch(updateReport(branchID, eventID, {
					...(getState().reports[branchID] || {})[eventID],
					isCommitted: false
				}));
			}
		});
		dispatch(nextReportPage());
	};
}

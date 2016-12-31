import secureRandom from 'secure-random';
import { augur } from '../../../services/augurjs';
import { bytesToHex } from '../../../utils/bytes-to-hex';
import { CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import { updateReport } from '../../reports/actions/update-reports';
import { nextReportPage } from '../../reports/actions/next-report-page';
import { selectOutcomeName } from '../../reports/selectors/reportable-outcomes';
import { encryptReport } from '../../reports/actions/report-encryption';

export function commitReport(market, reportedOutcomeID, isUnethical, isIndeterminate) {
	return (dispatch, getState) => {
		const { branch, loginAccount, outcomesData } = getState();
		if (!loginAccount.address || !market || !reportedOutcomeID) {
			console.error('commitReport failed:', loginAccount.address, market, reportedOutcomeID);
			return dispatch(nextReportPage());
		}
		const marketID = market.id;
		const eventID = market.eventID;
		const branchID = branch.id;
		const period = branch.reportPeriod;
		console.debug(`committing to report ${reportedOutcomeID} on market ${marketID} event ${eventID} period ${period}...`);
		const salt = bytesToHex(secureRandom(32));
		const fixedReport = augur.fixReport(reportedOutcomeID, market.minValue, market.maxValue, market.type, isIndeterminate);
		console.log('fixedReport:', fixedReport);
		const report = {
			eventID,
			marketID,
			period,
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
		dispatch(updateReport(branchID, eventID, report));
		console.log('updated report:', eventID, report);
		const encrypted = encryptReport(fixedReport, loginAccount.derivedKey, salt);
		const outcomeName = selectOutcomeName(reportedOutcomeID, market.type, outcomesData[marketID]);
		dispatch(updateReport(branchID, eventID, { ...report }));
		augur.submitReportHash({
			event: eventID,
			reportHash: report.reportHash,
			encryptedReport: encrypted.report,
			encryptedSalt: encrypted.salt,
			ethics: Number(!isUnethical),
			branch: branchID,
			period,
			periodLength: branch.periodLength,
			onSent: res => console.log(`committing to report outcome ${outcomeName}: ${res.hash} ${res.callReturn}`),
			onSuccess: (res) => {
				const branchReports = getState().reports[branchID] || {};
				console.log('updating branchReports:', eventID, marketID, branchReports);
				dispatch(updateReport(branchID, eventID, {
					...branchReports[eventID],
					isCommitted: true
				}));
			},
			onFailed: (err) => {
				console.error('submitReportHash failed', err);
				const branchReports = getState().reports[branchID] || {};
				dispatch(updateReport(branchID, eventID, {
					...branchReports[eventID],
					isCommitted: false
				}));
			}
		});
		dispatch(nextReportPage());
	};
}

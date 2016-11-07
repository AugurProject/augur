import async from 'async';
import { SCALAR } from '../../markets/constants/market-types';
import { INDETERMINATE_OUTCOME_ID, INDETERMINATE_SCALAR_OUTCOME_ID } from '../../markets/constants/market-outcomes';
import { augur } from '../../../services/augurjs';
import { updateReports } from '../../reports/actions/update-reports';

export function loadReportDescriptors(callback) {
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
			augur.getEthicReport(branch.id, branch.reportPeriod, eventID, loginAccount.address, (ethics) => {
				// ethics values: 0=unethical, 1=ethical
				report.isUnethical = ethics === '0';
				branchReports[eventID] = report;
				nextReport();
			});
		}, (e) => {
			if (e) return callback(e);
			dispatch(updateReports({ [branch.id]: branchReports }));
			if (callback) callback(null);
		});
	};
}

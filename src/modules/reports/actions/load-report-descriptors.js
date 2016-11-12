import async from 'async';
import { CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import { INDETERMINATE_OUTCOME_ID } from '../../markets/constants/market-outcomes';
import { augur } from '../../../services/augurjs';
import { updateReports } from '../../reports/actions/update-reports';

export function loadReportDescriptors(callback) {
	return (dispatch, getState) => {
		const { branch, loginAccount, marketsData, reports } = getState();
		const branchReports = { ...reports[branch.id] };
		async.forEachOfSeries(branchReports, (report, eventID, nextReport) => {
			const marketData = marketsData[report.marketID];
			report.isScalar = marketData.type === SCALAR;
			report.isCategorical = marketData.type === CATEGORICAL;
			report.minValue = marketData.minValue;
			report.maxValue = marketData.maxValue;
			if (report.reportedOutcomeID === undefined) {
				report.isIndeterminate = false;
				report.isUnethical = false;
				branchReports[eventID] = report;
				return nextReport();
			}
			report.isIndeterminate = report.reportedOutcomeID === INDETERMINATE_OUTCOME_ID;
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

import async from 'async';
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types';
import { BINARY_INDETERMINATE_OUTCOME_ID, CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID } from 'modules/markets/constants/market-outcomes';
import { updateReports } from 'modules/reports/actions/update-reports';

export function loadReportDescriptors(callback) {
  return (dispatch, getState) => {
    const { branch, marketsData, reports } = getState();
    const branchReports = { ...reports[branch.id] };
    async.forEachOfSeries(branchReports, (report, eventID, nextReport) => {
      const marketData = marketsData[report.marketID];
      report.isScalar = marketData.type === SCALAR;
      report.isCategorical = marketData.type === CATEGORICAL;
      report.minValue = marketData.minValue;
      report.maxValue = marketData.maxValue;
      if (report.reportedOutcomeID === undefined) {
        report.isIndeterminate = false;
        branchReports[eventID] = report;
        return nextReport();
      }
      const indeterminateOutcomeID = marketData.type === BINARY ?
        BINARY_INDETERMINATE_OUTCOME_ID :
        CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID;
      report.isIndeterminate = report.reportedOutcomeID === indeterminateOutcomeID;
      branchReports[eventID] = report;
      nextReport();
    }, (e) => {
      if (e) return callback(e);
      dispatch(updateReports({ [branch.id]: branchReports }));
      if (callback) callback(null);
    });
  };
}

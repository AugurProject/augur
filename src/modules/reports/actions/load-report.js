import { augur } from 'services/augurjs';
import { updateReport } from 'modules/reports/actions/update-reports';

export function loadReport(branchID, period, eventID, marketID, callback) {
  return (dispatch, getState) => {
    const { loginAccount, marketsData } = getState();
    const market = marketsData[marketID];
    if (!market) {
      console.error('loadReport failed:', branchID, marketID, market);
      return callback(null);
    }
    augur.reporting.getReport(branchID, period, eventID, loginAccount.address, market.minPrice, market.maxPrice, market.type, (report) => {
      console.log('got report:', report);
      if (!report || !report.report || report.error) {
        return callback(report || 'getReport failed');
      }
      const reportedOutcomeID = report.report;
      if (reportedOutcomeID && reportedOutcomeID !== '0' && !reportedOutcomeID.error) {
        dispatch(updateReport(branchID, eventID, {
          period,
          marketID,
          reportedOutcomeID,
          isIndeterminate: report.isIndeterminate,
          isSubmitted: true
        }));
      }
      callback(null);
    });
  };
}

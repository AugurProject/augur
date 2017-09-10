// import { augur } from 'services/augurjs';
// import { updateReport } from 'modules/reports/actions/update-reports';
import logError from 'utils/log-error';

const loadReport = (branchID, reportingWindow, marketID, callback = logError) => (dispatch, getState) => {
  // const { loginAccount, marketsData } = getState();
  // const market = marketsData[marketID];
  // if (!market) {
  //   return callback(`loadReport failed: ${branchID} ${marketID} ${JSON.stringify(market)}`);
  // }
  // dispatch(updateReport(branchID, eventID, {
  //   reportingWindow,
  //   marketID,
  //   payoutNumerators,
  //   isIndeterminate: report.isIndeterminate,
  //   isSubmitted: true
  // }));
  // callback(null);
};

export default loadReport;

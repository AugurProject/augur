import { augur } from 'services/augurjs';
import { CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types';
import { updateReport } from 'modules/reports/actions/update-reports';
import { nextReportPage } from 'modules/reports/actions/next-report-page';

export const submitReport = (market, reportedOutcomeID, isIndeterminate, history) => (dispatch, getState) => {
  const { branch, loginAccount } = getState();
  if (!loginAccount.address || !market || !reportedOutcomeID) {
    return console.error('submitReport failed:', loginAccount.address, market, reportedOutcomeID);
  }
  const branchID = branch.id;
  console.log(`submit report ${reportedOutcomeID} on market ${market.id} period ${branch.currentReportingWindowAddress}...`);
  const fixedReport = augur.reporting.format.fixReport(reportedOutcomeID, market.minPrice, market.maxPrice, market.type, isIndeterminate);
  const report = {
    marketID: market.id,
    period: branch.currentReportingWindowAddress,
    reportedOutcomeID,
    isCategorical: market.type === CATEGORICAL,
    isScalar: market.type === SCALAR,
    isIndeterminate,
    isSubmitted: false
  };
  dispatch(updateReport(branchID, market.id, { ...report }));
  augur.reporting.submitReport({
    _signer: getState().loginAccount.privateKey,
    market: market.id,
    report: fixedReport,
    branch: branchID,
    period: branch.currentReportingWindowAddress,
    reportingPeriodDurationInSeconds: branch.reportingPeriodDurationInSeconds,
    onSent: () => {},
    onSuccess: (r) => {
      dispatch(updateReport(branchID, market.id, {
        ...(getState().reports[branchID] || {})[market.id],
        isSubmitted: true
      }));
    },
    onFailed: (e) => {
      console.error('submitReport failed:', e);
      dispatch(updateReport(branchID, market.id, {
        ...(getState().reports[branchID] || {})[market.id],
        isSubmitted: false
      }));
    }
  });
  dispatch(nextReportPage(history));
};

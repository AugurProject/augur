import async from 'async';
import BigNumber from 'bignumber.js';
import { augur } from 'services/augurjs';
import { updateBranch } from 'modules/branch/actions/update-branch';
import syncBranch from 'modules/branch/actions/sync-branch';
import getReportingCycle from 'modules/branch/selectors/reporting-cycle';
import { syncBlockchain } from 'modules/app/actions/sync-blockchain';
import { listenToUpdates } from 'modules/app/actions/listen-to-updates';
import loadTopics from 'modules/topics/actions/load-topics';
import { loadMarketsToReportOn } from 'modules/reports/actions/load-markets-to-report-on';
import logError from 'utils/log-error';

export const loadBranch = (branchID, callback = logError) => (dispatch, getState) => {
  const branchPayload = { tx: { to: branchID } };
  async.parallel({
    reputationTokenAddress: (next) => {
      augur.api.Branch.getReputationToken(branchPayload, (err, reputationTokenAddress) => {
        if (err) return next(err);
        next(null, reputationTokenAddress);
      });
    },
    reportingPeriodDurationInSeconds: (next) => {
      augur.api.Branch.getReportingPeriodDurationInSeconds(branchPayload, (err, reportingPeriodDurationInSeconds) => {
        if (err) return next(err);
        next(null, new BigNumber(reportingPeriodDurationInSeconds, 16).toFixed());
      });
    }
  }, (err, staticBranchData) => {
    if (err) return callback(err);
    dispatch(updateBranch({ ...staticBranchData, id: branchID }));
    dispatch(updateBranch(getReportingCycle()));
    dispatch(syncBlockchain());
    dispatch(syncBranch((err) => {
      if (err) return callback(err);
      dispatch(listenToUpdates());
      callback(null);
    }));
    dispatch(loadTopics());
    dispatch(loadMarketsToReportOn());
  });
};

import loadDataFromAugurNode from 'modules/app/actions/load-data-from-augur-node';
import { updateHasLoadedReports } from 'modules/reports/actions/update-has-loaded-reports';
import { clearReports, updateReports } from 'modules/reports/actions/update-reports';
import logError from 'utils/log-error';

export const loadMarketsToReportOn = (options, callback = logError) => (dispatch, getState) => {
  const { branch, env, loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  if (!branch.id) return callback(null);
  const query = { ...options, branch: branch.id, reporter: loginAccount.address };
  loadDataFromAugurNode(env.augurNodeURL, 'getMarketsToReportOn', query, (err, reports) => {
    if (err) return callback(err);
    if (reports == null) {
      dispatch(updateHasLoadedReports(false));
      return callback(`no reports data received from ${env.augurNodeURL}`);
    }
    dispatch(clearReports());
    dispatch(updateReports(reports));
    dispatch(updateHasLoadedReports(true));
    callback(null, reports);
  });
};

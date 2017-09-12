import loadDataFromAugurNode from 'modules/app/actions/load-data-from-augur-node';
import { updateHasLoadedReports } from 'modules/reports/actions/update-has-loaded-reports';
import { clearReports, updateReports } from 'modules/reports/actions/update-reports';
import isObject from 'utils/is-object';
import logError from 'utils/log-error';

const loadReports = (callback = logError) => (dispatch, getState) => {
  const { branch, env, loginAccount } = getState();
  if (!loginAccount || !loginAccount.address || !branch.id) return callback(null);
  loadDataFromAugurNode(env.augurNodeURL, 'getReports', { branch: branch.id, reporter: loginAccount.address }, (err, reports) => {
    if (err) return callback(err);
    if (reports == null) {
      dispatch(updateHasLoadedReports(false));
      callback(`no reports data received from ${env.augurNodeURL}`);
    } else if (isObject(reports) && Object.keys(reports).length) {
      dispatch(clearReports());
      dispatch(updateReports(reports));
      callback(null, reports);
    }
  });
};

export default loadReports;

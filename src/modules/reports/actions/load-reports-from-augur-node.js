import loadDataFromAugurNode from 'modules/app/actions/load-data-from-augur-node';
import { updateAugurNodeConnectionStatus } from 'modules/app/actions/update-connection';
import { updateReports } from 'modules/reports/actions/update-reports';
import isObject from 'utils/is-object';
import logError from 'utils/log-error';

const loadReportsFromAugurNode = (callback = logError) => (dispatch, getState) => {
  const { env, loginAccount } = getState();
  loadDataFromAugurNode(env.augurNodeURL, 'getReports', { reporter: loginAccount.address }, (err, reports) => {
    if (err) return callback(err);
    if (reports == null) {
      dispatch(updateAugurNodeConnectionStatus(false));
      callback('loadReportsFromAugurNode: no reports data returned');
    } else if (isObject(reports) && Object.keys(reports).length) {
      dispatch(updateReports(reports));
      callback(null, reports);
    }
  });
};

export default loadReportsFromAugurNode;
